const bootCheckListModel = require('../models/boatCheckListModel');

// Yeni checklist oluştur
exports.createChecklist = async (req, res) => {
  const {_id} = req.body;
  try {
    const createdAt = new Date(); // Şu anki tarih
    let checklistData;

    switch (_id) {
      case "1":
        checklistData = {
          _id:_id,
          title: "Tekne Bakım Çizelge",
          week: createdAt, // Haftayı oluşturmak için mevcut tarihi kullanıyoruz
          questions: [
            { questionText: "Tekne No:", type: "note",questionType: "1" },
            { questionText: "Tekne etrafındaki lastikler düzgün mü?", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Motor ve etrafı temiz mi?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Motor ve yağı tamam mi?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Motor Kulakları sağlam mı? Vidalar sıkı mı?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Şanzuman yağı tamam mi?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Şaft şanzuman bağlantı somunları sıkı mı?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Radyatör suyu tam mi?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Motor kayışları kontrol(gergi,çatlak var mı?)", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Dümen yağı tam mi?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Yeke ve yeke piston kontrolü", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Motor devirdaim çalışıyormu?(Bağlantı vidaları sıkı mı?)", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Hidrolik pompa bağlantı somunları sıkı mi?", type: "note",questionType: "1",region:"Motor" },
            { questionText: "Hidrolik yağ tam mı?", type: "note",questionType: "1" ,region:"Motor"},
            { questionText: "Yemleme sisteminde yağ kaçakları kontrol.", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Yemleme sayaçları kontrol.", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Yemleme düğmeleri kontrol.", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Yemleme hortum kontrolü.", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Sintine kontrolü.", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Buzzer ve lambalar kontrol.", type: "note",questionType: "1",region:"Elektrik" },
            { questionText: "Saat kontrolü(devir,hararet,yağ)", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Yangın tüpü ve can simidi varmı?", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Çalışma saati", type: "note",questionType: "1",region:"Gövde" },
            { questionText: "Kaptan", type: "signature",questionType: "2" },
            { questionText: "Mevkii", type: "note",questionType: "3" },
            { questionText: "Bakımcı adı", type: "signature",questionType: "4" },
            { questionText: "Usta Başı", type: "signature",questionType: "5" },
            { questionText: "Sorumlu Mühendis", type: "signature",questionType: "6" },
            { questionText: "Not", type: "note",questionType: "1" }
          ]
        };
        break;

      case "2":
         checklistData = {
          _id:_id,
          title: "Jeneratör Bakım Çizelge",
          week: createdAt, // Haftayı oluşturmak için mevcut tarihi kullanıyoruz
          questions: [
            { questionText: "Jeneratör No:", type: "note",questionType: "1" },
          {questionText: "Salda ise etrafındaki lastikler düzgün mü?", type: "note",questionType: "1",region:"Gövde" },
          {questionText: "Motor ve etrafı temiz mi?", type: "note",questionType: "1",region:"Motor" },
          {questionText: "Motor yağı tamam mı?", type: "note",questionType: "1",region:"Motor" },
          {questionText: "Radyatör suyu tamam mı?", type: "note",questionType: "1",region:"Makina Dairesi" },
          {questionText: "Yangın tüpü var mı?", type: "note",questionType: "1",region:"Gövde" },
          {questionText: "Çalışma saati?", type: "note",questionType: "1" },
          { questionText: "Kaptan", type: "signature",questionType: "2" },
          { questionText: "Mevkii", type: "note",questionType: "3" },
          { questionText: "Bakımcı adı", type: "signature",questionType: "4" },
          { questionText: "Usta Başı", type: "signature",questionType: "5" },
          { questionText: "Sorumlu Mühendis", type: "signature",questionType: "6" },
          { questionText: "Not", type: "note",questionType: "1" }
          ]
        };
        break;

      case "3":
        checklistData = {
          _id: _id,
          title: "Vinç Bakım Çizelge",
          week: createdAt,
          questions: [
            { questionText: "Vinç No:", type: "note",questionType: "1" },
          
          {questionText: "Motor ve etrafı temiz mi?", type: "note",questionType: "1",region:"Motor" },
          {questionText: "Motor yağı tamam mı?", type: "note",questionType: "1",region:"Motor" },
          {questionText: "Radyatör suyu tamam mı?", type: "note",questionType: "1",region:"Makina Dairesi" },
          {questionText: "Buzzer ve lambalar kontrol", type: "note",questionType: "1",region:"Elektrik" },
          {questionText: "Vinç yağ tankı dolu mu?", type: "note",questionType: "1",region:"Vinç" },
          {questionText: "Bomlara sprey gres sıkılacak", type: "note",questionType: "1",region:"Vinç" },
          {questionText: "Saat kontrolü (devir,hararet,yağ )", type: "note",questionType: "1",region:"Elektrik" },
          {questionText: "Vinç sisteminde yağ kaçakları kontrol (bom,kilit vb. )", type: "note",questionType: "1",region:"Vinç" },
          {questionText: "Yangın tüpü varmı?", type: "note",questionType: "1",region:"Gövde" },
          {questionText: "Çalışma saati?", type: "note",questionType: "1" },
          { questionText: "Kaptan", type: "signature",questionType: "2" },
          { questionText: "Mevkii", type: "note",questionType: "3" },
          { questionText: "Bakımcı adı", type: "signature",questionType: "4" },
          { questionText: "Usta Başı", type: "signature",questionType: "5" },
          { questionText: "Sorumlu Mühendis", type: "signature",questionType: "6" },
          { questionText: "Not", type: "note",questionType: "1" }
          ]
        };
        break;

      default:
        return res.status(400).json({ message: "Invalid ID provided." });
    }

   
  


    console.log(_id,checklistData);
    

    // Yeni checklist verisi oluşturuluyor
    const newChecklist = new bootCheckListModel(checklistData);

    // Checklist kaydediliyor
    await newChecklist.save();

    res.status(201).json({
      message: 'Checklist created successfully',
      checklist: newChecklist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checklist', error });
  }
};

// Belirli bir checklist'teki tüm soruları getir
exports.getQuestionsByChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const checklist = await bootCheckListModel.findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    res.status(200).json({ questions: checklist.questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};

// Belirli bir soruyu güncelle
exports.updateQuestion = async (req, res) => {
  try {
    const { checklistId, questionId } = req.params;
    const { questionText, type } = req.body;

    const checklist = await bootCheckListModel.findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    const question = checklist.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.questionText = questionText || question.questionText;
    question.type = type || question.type;

    await checklist.save();
    res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error });
  }
};

// Belirli bir soruyu sil
exports.deleteQuestion = async (req, res) => {
  try {
    const { checklistId, questionId } = req.params;

    const checklist = await bootCheckListModel.findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    const question = checklist.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.remove();
    await checklist.save();
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
};
