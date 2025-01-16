import React from "react";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoSansThai",
  src: "/fonts/NotoSansThai-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "NotoSansThai",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerImage: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 20,
    flex: 1,
  },
  section: {
    marginBottom: 10,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
    borderBottom: "1px solid black",
    paddingBottom: 2,
  },
});

export async function exportPdf(item, getFullName) {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            src="/images/company_logo/company_logo.png"
          />
          <Text style={styles.headerText}>
            ใบขออัตรากำลังคน : Personnel Request
          </Text>
        </View>

        {/* Document Fields */}
        <View style={styles.section}>
          <View style={styles.textRow}>
            <Text style={styles.label}>รหัสเอกสาร ID:</Text>
            <Text style={styles.value}>
              {item.personalRequestDocumentId || "-"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.label}>สถานะ:</Text>
            <Text style={styles.value}>
              {item.personalRequestStatus || "-"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.label}>สร้างโดย:</Text>
            <Text style={styles.value}>
              {getFullName(item.PersonalRequestCreateBy) || "-"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.label}>สร้างเมื่อ:</Text>
            <Text style={styles.value}>
              {new Date(item.personalRequestCreateAt).toLocaleString() || "-"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.label}>อัปเดตโดย:</Text>
            <Text style={styles.value}>
              {getFullName(item.PersonalRequestUpdateBy) || "-"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.label}>อัปเดตเมื่อ:</Text>
            <Text style={styles.value}>
              {item.personalRequestUpdateAt
                ? new Date(item.personalRequestUpdateAt).toLocaleString()
                : "-"}
            </Text>
          </View>
        </View>

        {/* Additional Sections can be added below */}
      </Page>
    </Document>
  );

  try {
    const blob = await pdf(<MyDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PDF");
  }
}
