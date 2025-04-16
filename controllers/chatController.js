// controllers/chatController.js
const pubnub = require('../pubnubConfig');
const Message = require('../models/messageModel');

exports.grantAccess = async (req, res) => {
    const { channel, authKey } = req.body;
  
    try {
      // Ensure channel and authKey are provided
      if (!channel || !authKey) {
        return res.status(400).json({
          error: "Channel and authKey must be provided."
        });
      }
  
      const token = await pubnub.grantToken({
        ttl: 1440,  // Token validity in minutes
        permissions: {
          resources: {
            channels: {
              [channel]: {  // Specify the channel to grant access to
                read: true,  // Allow read access
                write: true, // Allow write access
                manage: true // Allow manage access (for subscriptions)
              }
            },
            users: {}, // Optional: Specify users if needed
            spaces: {} // Optional: Specify spaces if using PubNub Objects
          },
          patterns: {  // Wildcard patterns if needed
            channels: {}, // Optional: Leave empty if no patterns
            users: {},
            spaces: {}
          }
        },
        meta: {
          uuid: authKey // User ID or unique identifier
        }
      });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).json({
        error: 'Failed to grant access.',
        details: error.status ? error.status.message : 'Unknown error'
      });
    }
  };
// Mesaj gönderme
exports.sendMessage = async (req, res) => {
  const { channel, message,user } = req.body;
  console.log("Gelen veriler:", req.body);  // Gelen verileri kontrol edin
  try {

   
    // Mesajı istediğiniz formata çevirin
    const newMessage = {
      _id: Math.random().toString(36).substr(2, 9),
      message,
      createdAt: new Date(),
      user: {
        _id: user._id,
        username: user.name || 'Unknown',
      },
      channel,
    };


    // Mesajı MongoDB'ye kaydedin
    const savedMessage = await new Message(newMessage).save();

    // PubNub veya başka bir platforma mesajı yayınlayın
    pubnub.publish(
      {
        channel,
        message: newMessage,
      },
      (status, response) => {
        if (status.error) {
          console.error('Mesaj gönderme hatası:', status);
          return res.status(500).json({ error: 'Mesaj gönderilemedi' });
        }
        return res.status(200).json(savedMessage); // Hem MongoDB'ye kaydedilen hem de gönderilen mesajı geri döndürün
      }
    );
  } catch (error) {
    console.error('Mesaj kaydetme hatası:', error);
    res.status(500).json({ error: 'Mesaj kaydedilemedi' });
  }
};


// Geçmiş mesajları çek
exports.getMessages = async (req, res) => {
  const { channel } = req.params;

  try {
    // Veritabanından kanala göre mesajları çek
    const messages = await Message.find({ channel }).sort({ createdAt: -1 }).limit(10).exec();

    const result = await pubnub.history({
      channel: channel,
      count: 100, // Geri alınacak mesaj sayısını belirleyin
      reverse:true,
    });
  
    // Promise çözümlendiğinde sonucu yazdır
   console.log("MESSAGES=",result.messages);
    
    const formattedMessages = messages.map(msg => ({
      
      _id: msg._id,
      text: msg.message,
      createdAt: msg.createdAt,
      user: {
        _id: msg.user._id,
        username: msg.user.username,
      },
    }));
// Sadece _id alanı olan mesajları filtreleyin
const msgs = result.messages
  .filter((msg) => msg.entry && msg.entry._id) // _id'ye sahip olan mesajları filtrele
  .map((msg) => ({
    _id: msg.entry._id || msg.timetoken, // Eşsiz mesaj ID'si
    text: msg.entry.message, // Mesaj içeriği
    createdAt: new Date(msg.entry.createdAt || msg.timetoken / 10000), // Timetoken'u tarihe çevir
    user: {
      _id: msg.entry.user._id,
      name: msg.entry.user.username,
    },
  }));
const newMsg=msgs.reverse();
console.log("MESSAGES=",newMsg);

    res.status(200).json(newMsg);
  } catch (error) {
    console.error('Veritabanından mesajları çekerken hata:', error);
    res.status(500).json({ error: 'Geçmiş mesajlar çekilemedi.' });
  }
};
exports.addChannel = async (req, res) => {
  const { channel } = req.params; // Channel name from the request

  try {
    // Since PubNub does not require explicit channel creation, you can use it directly
    console.log("Adding channel:", channel);

    // You can check the channel's subscription status or message activity if needed
    // For example, retrieving message history
    const result = await pubnub.history({
      channel: channel,
      count: 10 // Fetch last 10 messages (optional)
    });

    console.log("Channel History:", result);

    res.status(200).json({ success: true, message: `Channel ${channel} is now active.` });
  } catch (error) {
    console.error('Error occurred while adding the channel:', error);
    res.status(500).json({ error: 'Channel creation error.' });
  }
};
