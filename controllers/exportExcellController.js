const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Excel'e veri yazma fonksiyonu
exports.exportToExcel = async (palletDataArray, scannedWeights, order) => {
    const workbook = new ExcelJS.Workbook();
    const palletNameCounter = {};
  
    // Pallet Data'ları döngüye alalım
    for (const palletData of palletDataArray) {
      const palletNumber = palletData?.palletNumber || 'N/A';
  
      // Palet numarasının kaç kere kullanıldığını kontrol et
      if (!palletNameCounter[palletNumber]) {
        palletNameCounter[palletNumber] = 0;
      }
      palletNameCounter[palletNumber] += 1;
  
      const suffix = palletNameCounter[palletNumber] > 1 ? String.fromCharCode(64 + palletNameCounter[palletNumber]) : '';
      const worksheetName = `Pallet-${palletNumber}${suffix}`;
      const worksheet = workbook.addWorksheet(worksheetName);
  
      const total = palletData?.weights.reduce((a, b) => a + b.weight, 0);
      const weightsData = (palletData?.weights || []).map((weight, index) => [`${index + 1}`, weight.weight]);
  
      const data = [
        ['PALLET LİST'],
        ['Pallet Number', palletNumber],
        ['Number of Boxes', (palletData?.weights.length || 0) + (scannedWeights.length || 0)],
        ['Ranges', palletData?.ranges.length > 0 ? `${palletData.ranges[0].min}-${palletData.ranges[0].max}` : 'N/A'],
        ['Company', order || 'N/A'],
        ['TOTAL NET', total],
        ...weightsData,
        ['TOTAL NET', total]
      ];
  
      // Data'yı ekleyin
      data.forEach((row) => worksheet.addRow(row));
  
      // Stiller
      worksheet.mergeCells('A1:B1');
      const mergedCell = worksheet.getCell('A1');
      mergedCell.value = 'Palet Bilgileri';
      mergedCell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } },
        font: { bold: true, color: { argb: 'FF0000' } },
        alignment: { horizontal: 'center' }
      };
  
      worksheet.getColumn(1).width = 18;
      worksheet.getColumn(2).width = 15;
  
      data.forEach((row, rowIndex) => {
        const excelRow = worksheet.getRow(rowIndex + 1);
  
        row.forEach((cellValue, colIndex) => {
          const cell = excelRow.getCell(colIndex + 1);
          cell.value = cellValue;
          cell.style = {
            alignment: { horizontal: 'center' },
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          };
        });
      });
    }
  
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const filePath = path.join(__dirname, `${order}-pallets.xlsx`);
      fs.writeFileSync(filePath, buffer);
      console.log('Excel dosyası başarıyla oluşturuldu:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error creating Excel file:', error);
      throw new Error('Failed to create Excel file');
    }
  };
