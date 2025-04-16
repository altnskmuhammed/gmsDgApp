const Report = require('../models/reportModel');

// Create a new report
const createReport = async (req, res) => {
  try {
    const { title, description, region, checklistId,component } = req.body;

    // Check if all required fields are present
    if (!title || !description || !region) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const newReport = new Report({
      title,
      description,
      region,
      checklistId, // Opsiyonel alan
      component
    });

    await newReport.save();
    res.status(201).json({ message: 'Report created successfully.', report: newReport });
  } catch (error) {
    res.status(500).json({ message: 'Error creating report.', error });
  }
};

// Update an existing report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params; // ID in URL params
    const { title, description, region, checklistId,status,component,userId,materials } = req.body;

    // Find the report by ID and update it
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { title, description, region, checklistId,status,component,userId,materials },
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report updated successfully.', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report.', error });
  }
};

// Get a report by ID
const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report by ID
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report.', error });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports.', error });
  }
};

module.exports = {
  createReport,
  updateReport,
  getReport,
  getAllReports,
};
