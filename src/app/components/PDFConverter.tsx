'use client';

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { 
    padding: 12,  
    fontFamily: "Helvetica",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  headerContainer: { 
    alignItems: "center", 
    paddingVertical: 6,  
    backgroundColor: "white", 
    borderRadius: 4, 
    marginBottom: 0, 
  },
  headerContent: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  // Increased logo size: width and height increased
  logoContainer: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, // half of width/height
    overflow: "hidden", 
    marginRight: 5 
  },
  logoImage: { 
    width: "100%", 
    height: "100%" 
  },
  // Updated font size for MoneyCache to 25
  headerTitle: { 
    fontSize: 25, 
    fontWeight: "bold", 
    color: "#333" 
  },

  table: { 
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 4, 
    overflow: "hidden", 
  },

  row: { 
    flexDirection: "row", 
    paddingVertical: 4,  
    alignItems: "center",
  },

  headerRow: { 
    backgroundColor: "#1669b2", 
    paddingVertical: 5 
  },
  headerCell: { 
    flex: 1, 
    textAlign: "center", 
    fontSize: 12, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  // New style for Particulars header cell: left aligned with padding
  particularHeader: { 
    textAlign: "left", 
    paddingLeft: 8 
  },

  cell: { 
    flex: 1, 
    textAlign: "center", 
    fontSize: 10, 
    paddingVertical: 3 
  },
  // New style for Particulars data cell: left aligned with padding
  particularCell: { 
    textAlign: "left", 
    paddingLeft: 8 
  },

  evenRow: { 
    backgroundColor: "#f8f8f8" 
  },
  oddRow: { 
    backgroundColor: "#ffffff" 
  },

  // Redesigned footer with two columns
  footerContainer: { 
    paddingVertical: 8,  
    paddingHorizontal: 12,
    backgroundColor: "white", 
    borderRadius: 4, 
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  footerLeft: {
    flexDirection: "column",
  },
  footerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  footerText: { 
    fontSize: 8, 
    color: "#333333E6", 
    fontWeight: "bold" 
  },
  footerSubText: { 
    fontSize: 7, 
    color: "#333333E6" 
  },
  footerDateTime: {
    fontSize: 8,
    color: "#333333E6",
  },
});

interface PDFDocumentProps {
  data: { 
    particular: string; 
    am: number | string; 
    mid: number | string; 
    pm: number | string; 
    gross_total: number; 
    net_total: number;
  }[];
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ data }) => {
  // Get current date and time in desired format
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image src="/LogoIcon.png" style={styles.logoImage} />
            </View>
            <Text style={styles.headerTitle}>
              <Text style={{ color: "#6abd45" }}>Money</Text>
              <Text style={{ color: "#1669b2" }}>Cache</Text>
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerCell, styles.particularHeader]}>Particulars</Text>
            <Text style={styles.headerCell}>AM</Text>
            <Text style={styles.headerCell}>MID</Text>
            <Text style={styles.headerCell}>PM</Text>
            <Text style={styles.headerCell}>Gross Total</Text>
            <Text style={styles.headerCell}>Net Total</Text>
          </View>

          {data.map((row, index) => (
            <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
              <Text style={[styles.cell, styles.particularCell]}>{row.particular}</Text>
              <Text style={styles.cell}>{row.am}</Text>
              <Text style={styles.cell}>{row.mid}</Text>
              <Text style={styles.cell}>{row.pm}</Text>
              <Text style={styles.cell}>{row.gross_total}</Text>
              <Text style={styles.cell}>{row.net_total}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerText}>MoneyCache Financial Report</Text>
            <Text style={styles.footerSubText}>Confidential - Authorized Use Only</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerDateTime}>Report Date: {formattedDate}</Text>
            <Text style={styles.footerDateTime}>Report Time: {formattedTime}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
