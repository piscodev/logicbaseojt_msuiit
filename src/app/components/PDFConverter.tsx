
// REFERENCE: https://www.youtube.com/watch?v=Ch4Zm-KO_EY
'use client'

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, textAlign: "center", marginBottom: 10 },
  table: { display: "flex", width: "100%", borderWidth: 1, borderColor: "#000" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#000", padding: 5 },
  header: { backgroundColor: "#f2f2f2", fontWeight: "bold" },
  cell: { flex: 1, textAlign: "center", fontSize: 10, padding: 5 },
})

interface PDFDocumentProps {
  data: { particular: string; am: number | string; mid: number | string; pm: number | string; gross_total: number; net_total: number }[];
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Transaction Report</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>Particulars</Text>
          <Text style={styles.cell}>AM</Text>
          <Text style={styles.cell}>MID</Text>
          <Text style={styles.cell}>PM</Text>
          <Text style={styles.cell}>Gross Total</Text>
          <Text style={styles.cell}>Net Total</Text>
        </View>
        {/* Table Rows */}
        {data.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{row.particular}</Text>
            <Text style={styles.cell}>{row.am}</Text>
            <Text style={styles.cell}>{row.mid}</Text>
            <Text style={styles.cell}>{row.pm}</Text>
            <Text style={styles.cell}>{row.gross_total}</Text>
            <Text style={styles.cell}>{row.net_total}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

export default PDFDocument
