package io.dataease.commons.utils;

import java.io.BufferedOutputStream;
import java.io.File;

import cn.hutool.core.io.FileUtil;
import io.dataease.commons.model.excel.ExcelSheetModel;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


public class ExcelUtils {
    private static final String suffix = ".xlsx";

    public static File exportExcel(List<ExcelSheetModel> sheets, String fileName) throws Exception {
        AtomicReference<String> realFileName = new AtomicReference<>(fileName);
        Workbook wb = new XSSFWorkbook();

        sheets.forEach(sheet -> {

            List<List<String>> details = sheet.getData();
            details.add(0, sheet.getHeads());
            String sheetName = sheet.getSheetName();
            Sheet curSheet = wb.createSheet(sheetName);
            if (StringUtils.isBlank(fileName)) {
                String cName = sheetName + suffix;
                realFileName.set(cName);
            }

            CellStyle cellStyle = wb.createCellStyle();
            Font font = wb.createFont();
            font.setFontHeightInPoints((short) 12);
            font.setBold(true);
            cellStyle.setFont(font);
            cellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            if (CollectionUtils.isNotEmpty(details)) {
                for (int i = 0; i < details.size(); i++) {
                    Row row = curSheet.createRow(i);
                    List<String> rowData = details.get(i);
                    if (rowData != null) {
                        for (int j = 0; j < rowData.size(); j++) {
                            Cell cell = row.createCell(j);
                            cell.setCellValue(rowData.get(j));
                            if (i == 0) {// 头部
                                cell.setCellStyle(cellStyle);
                                // 设置列的宽度
                                curSheet.setColumnWidth(j, 255 * 20);
                            }
                        }
                    }
                }
            }
        });
        if (!StringUtils.endsWith(fileName, suffix)) {
            realFileName.set(realFileName.get() + suffix);
        }
        File result = new File("/opt/dataease/data/" + realFileName.get());
        BufferedOutputStream outputStream = FileUtil.getOutputStream(result);
        try {
            wb.write(outputStream);
        } catch (Exception e) {
            LogUtil.error(e.getMessage(), e);
            throw e;
        } finally {
            wb.close();
            outputStream.flush();
            outputStream.close();
        }
        return result;
    }

}
