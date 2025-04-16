const Response = require('../models/responseModel');
const bootCheckListModel = require('../models/boatCheckListModel');
const mongoose = require('mongoose');
// Yeni cevap listesi oluştur
exports.createResponseList = async (req, res) => {
  try {
    const { checklistId, week, userId } = req.body;

    // Check if the checklist exists
    const checklist = await mongoose.model('boatCheckList').findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found', checklistId });
    }
   
    // Map questions to responses, with default for questionType
    const responses = checklist.questions.map((question, index) => {
    
      
  
      return {
        questionId: question._id,
        answer: null,
        status: 'unchecked',
        questionType: question.questionType || '1', // Default value added
      };
    });

    // Create a new response list
    const newResponse = new (mongoose.model('Response'))({
      checklistId,
      week,
      userId,
      responses,
    });

    await newResponse.save();

    // Populate question details manually
    const populatedResponses = newResponse.responses.map((response) => {
      const question = checklist.questions.find((q) => q._id.equals(response.questionId));
      
      return {
        ...response._doc,
        questionText: question.questionText,
        type: question.type,
        questionType: question.questionType,
      };
    });

    res.status(201).json({
      message: 'Response list created successfully',
      response: { ...newResponse._doc, responses: populatedResponses },
    });
  } catch (error) {
    console.error('Error in createResponseList:', error);
    res.status(500).json({ message: 'Error creating response list', error });
  }
};




// Belirli bir haftaya ait cevap listesini getir
exports.getResponseList = async (req, res) => {
  try {
    const { week } = req.query;

    if (!week) {
      return res.status(400).json({ message: 'Week parameter is required' });
    }

    const responseList = await Response.find({ week }).populate('checklistId');
    if (!responseList || responseList.length === 0) {
      return res.status(404).json({ message: 'No response lists found for the specified week' });
    }

    const responseWithDetails = responseList.map(response => {
      const responsesWithQuestions = response.responses.map(res => {
        const question = response.checklistId.questions.find(q => q._id.toString() === res.questionId.toString());
        return {
          questionText: question?.questionText || "Question not found",
          questionId: res.questionId,
          answer: res.answer,
          status: res.status,
        };
      });

      // Tüm checklist bilgilerini ekliyoruz
      return {
        week: response.week,
        checklistId: response.checklistId._id,
       
        responses: responsesWithQuestions,
      };
    });

    res.status(200).json({ responseList: responseWithDetails });
  } catch (error) {
    console.error("Error fetching response lists:", error);
    res.status(500).json({ message: 'Error fetching response lists', error });
  }
};

// Birden fazla cevabı aynı anda güncelle
exports.updateResponseList = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { responses } = req.body;
    
    const response = await Response.findById(responseId);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    responses.forEach((updatedResponse) => {
      const questionResponse = response.responses.find(
        (r) => r.questionId.toString() === updatedResponse?._id
      );
    
      if (questionResponse) {
        console.log('questionResponse before update:', questionResponse);
        questionResponse.answer = updatedResponse?.answer;
        questionResponse.status = updatedResponse?.status;
        console.log('questionResponse after update:', questionResponse);
      }
    });

    // Log response before saving to see if everything is correct
    console.log('Response before save:', response);

    const updatedResponse = await response.save();
    
    // Log the updated response to check the saved data
    console.log('Updated response after save:', updatedResponse);

    res.status(200).json({ message: 'Response list updated successfully', response: updatedResponse });
  } catch (error) {
    console.error('Error details:', error);  // Log the error for more details
    res.status(500).json({ message: 'Error updating response list', error });
  }
};

