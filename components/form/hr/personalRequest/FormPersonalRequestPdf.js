import React from "react";
import {
  pdf,
  Document,
  Page,
  Text,
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
    padding: 50,
    fontFamily: "NotoSansThai",
    fontSize: 12,
  },

  headerText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  
  image: {
    position: "absolute",
    top: 20,
    left: 50,
    width: 50,
    height: 50,
  },
  
  textBlock: {
    marginBottom: 5,
    border: 1,
  },
});

export async function exportPdf(item, getFullName) {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          style={styles.image}
          src="/images/company_logo/company_logo.png"
        />

        <Text style={styles.headerText}>
          ใบขออัตรากำลังคน : Personnel Request
        </Text>

        <Text style={styles.textBlock}>
          รหัสเอกสาร ID: {item.personalRequestDocumentId}
        </Text>
        <Text style={styles.textBlock}>
          Status: {item.personalRequestStatus}
        </Text>
        <Text style={styles.textBlock}>
          Created By: {getFullName(item.PersonalRequestCreateBy) || "-"}
        </Text>
        <Text style={styles.textBlock}>
          Created At:{" "}
          {new Date(item.personalRequestCreateAt).toLocaleString() || "-"}
        </Text>
        <Text style={styles.textBlock}>
          Updated By: {getFullName(item.PersonalRequestUpdateBy) || "-"}
        </Text>
        <Text style={styles.textBlock}>
          Updated At:{" "}
          {item.personalRequestUpdateAt
            ? new Date(item.personalRequestUpdateAt).toLocaleString()
            : "-"}
        </Text>
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
