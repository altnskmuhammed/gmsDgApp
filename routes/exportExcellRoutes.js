const express = require('express');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Route for exporting individual pallet data to Excel


router.post("/export-to-excel", async (req, res) => {
  const { palletDataArray, scannedWeights, order } = req.body;
  console.log("body", req.body);

  try {
    const workbook = new ExcelJS.Workbook();
    const palletNameCounter = {};

    for (const palletData of palletDataArray) {
      const palletNumber = palletData?.palletNumber || "N/A";

      // Palet adını kontrol ve ekleme
      if (!palletNameCounter[palletNumber]) {
        palletNameCounter[palletNumber] = 0;
      }
      palletNameCounter[palletNumber] += 1;

      const suffix =
        palletNameCounter[palletNumber] > 1
          ? String.fromCharCode(64 + palletNameCounter[palletNumber])
          : "";
      const worksheetName = `Pallet-${palletNumber}${suffix}`;
      const worksheet = workbook.addWorksheet(worksheetName);

      const total = palletData?.weights.reduce(
        (a, b) => a + b.weight,
        0
      );
      const weightsData = (palletData?.weights || []).map((weight, index) => [
        `${index + 1}`,
        weight.weight,
      ]);

      const data = [
        ["PALLET LIST"],
        ["Pallet Number", palletNumber],
        [
          "Number of Boxes",
          (palletData?.weights.length || 0) + (scannedWeights.length || 0),
        ],
        [
          "Ranges",
          palletData?.ranges.length > 0
            ? `${palletData.ranges[0].min}-${palletData.ranges[0].max}`
            : "N/A",
        ],
        ["Company", order || "N/A"],
        ["TOTAL NET", total],
        ...weightsData,
        ["TOTAL NET", total],
      ];

      data.forEach((row) => worksheet.addRow(row));

      worksheet.mergeCells("A1:B1");
      const mergedCell = worksheet.getCell("A1");
      mergedCell.value = "Pallet Information";
      mergedCell.style = {
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        },
        font: { bold: true, color: { argb: "FF0000" } },
        alignment: { horizontal: "center" },
      };

      worksheet.getColumn(1).width = 18;
      worksheet.getColumn(2).width = 15;

      data.forEach((row, rowIndex) => {
        const excelRow = worksheet.getRow(rowIndex + 1);

        row.forEach((cellValue, colIndex) => {
          const cell = excelRow.getCell(colIndex + 1);
          cell.value = cellValue;

          cell.style = {
            alignment: { horizontal: "center" },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            },
          };

          if (rowIndex === 0) {
            cell.style.font = { bold: true };
          }

          if (cellValue === "TOTAL NET") {
            cell.style.font = { size: 13, bold: true };
          }
        });
      });
    }

    // Excel dosyasını belleğe yaz
    const buffer = await workbook.xlsx.writeBuffer();
    console.log("buffer", buffer);

    // Base64 olarak kodla ve JSON ile gönder
    const base64Data = buffer.toString("base64");
    res.json({
      fileName: `${order || "pallets"}.xlsx`,
      base64: base64Data,
    });

  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Failed to generate Excel file." });
  }
});
router.post("/export-to-excel-summary", async (req, res) => {
  const { palletDataArray, order } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheetName = `${order} özet döküm`;
    const worksheet = workbook.addWorksheet(worksheetName);

    const headerRow = ["PALLET", "KG", "GRAMAJ", "STRAFOR ADET"];
    worksheet.addRow(headerRow);

    const palletNameCounter = {};
    let totalWeightForAllRanges = 0;
    let totalBoxCount = 0;
    const gramajTotals = [];

    palletDataArray.forEach((palletData) => {
      let palletNumber = palletData?.palletNumber || "N/A";
      
      if (!palletNameCounter[palletNumber]) {
        palletNameCounter[palletNumber] = 0;
      }
      palletNameCounter[palletNumber] += 1;
      const suffix = palletNameCounter[palletNumber] > 1 ? String.fromCharCode(64 + palletNameCounter[palletNumber]) : "";
      const palletLabel = `P-${palletNumber}${suffix}`;
      
      const totalWeight = palletData.weights.reduce((sum, weight) => sum + weight.weight, 0);
      totalWeightForAllRanges += totalWeight;

      const boxCount = palletData.weights.length;
      totalBoxCount += boxCount;

      const gramaj = palletData.ranges.length > 0 ? `${palletData.ranges[0].min}-${palletData.ranges[0].max}` : "N/A";
      let gramajRange = gramajTotals.find(g => g.range === gramaj);
      
      if (gramajRange) {
        gramajRange.totalWeight += totalWeight;
        gramajRange.box += boxCount;
      } else {
        gramajTotals.push({ range: gramaj, totalWeight, box: boxCount });
      }
      
      worksheet.addRow([palletLabel, totalWeight, gramaj, boxCount]);
    });

    worksheet.addRow([]);
    worksheet.addRow(["GRAMAJ ARALIĞI", "TOPLAM KG", "KUTU SAYISI"]);
    gramajTotals.forEach((gramajTotal) => {
      worksheet.addRow([gramajTotal.range, gramajTotal.totalWeight, gramajTotal.box]);
    });

    worksheet.addRow(["TOPLAM", totalWeightForAllRanges, totalBoxCount]);

    const buffer = await workbook.xlsx.writeBuffer();
    const base64Data = buffer.toString("base64");

    res.json({
      fileName: `${order}-ÖZET-DÖKÜM.xlsx`,
      base64: base64Data,
    });
  } catch (error) {
    console.error("Error generating Excel summary:", error);
    res.status(500).json({ message: "Failed to generate Excel summary." });
  }
});


module.exports = router;
