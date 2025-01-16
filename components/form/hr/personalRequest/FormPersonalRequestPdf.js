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
    padding: 20,
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
   signatureImage: {
      width: 100,
       height: 50,
       marginTop: 10,
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
  textCol: {
    flexDirection: "col",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    width: "100%",
    fontWeight: "bold",
  },
  value: {
    width: "100%",
    borderBottom: "1px solid black",
    paddingBottom: 2,
  },
});

export async function exportPdf(item, getFullName) {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            src="/images/company_logo/company_logo.png"
          />
          <Text style={styles.headerText}>
            ใบขออัตรากำลังคน : Personnel Request
          </Text>
        </View>

        <View style={styles.section}>

          <View style={styles.textRow}>
            <Text style={styles.label}>ด้วยข้าพเจ้า นาย / นาง / นางสาว:</Text>
            <Text style={styles.value}>{getFullName(item.PersonalRequestCreateBy) || "-"}</Text>

            <Text style={styles.label}>ตำแหน่ง:</Text>
             <Text style={styles.value}>
                {item.PersonalRequestCreateBy
                ?.employeeEmployment?.[0]?.EmploymentPositionId?.positionName || "-"}
            </Text>      
        </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>แผนก:</Text>
            <Text style={styles.value}>
                {item.PersonalRequestCreateBy
                ?.employeeEmployment?.[0]?.EmploymentDepartmentId?.departmentName || "-"}
            </Text>
            <Text style={styles.label}>มีความประสงค์ ขออัตรากำลังคนจำนวน :</Text>
            <Text style={styles.value}>{item.personalRequestAmount || "-"}</Text>
            <Text style={styles.label}>อัตรา</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>ในตำแหน่ง:</Text>
            <Text style={styles.value}>{item.PersonalRequestPositionId.positionName || "-"}</Text>

            <Text style={styles.label}>ประจำสาขา:</Text>
            <Text style={styles.value}>{item.PersonalRequestBranchId.branchName || "-"}</Text>

            <Text style={styles.label}>วันที่ต้องการ :</Text>
            <Text style={styles.value}>{item.personalRequestDesiredDate || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>ประเภทพนักงาน:</Text>
            <Text style={styles.value}>{item.personalRequestEmploymentType || "-"}</Text>

            <Text style={styles.label}>เหตุผลในการขอรับ:</Text>
            <Text style={styles.value}>{item.personalRequestReasonForRequest || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>คุณสมบัติ:</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>1.เพศ:</Text>
            <Text style={styles.value}>{item.personalRequestReasonGender || "-"}</Text>

            <Text style={styles.label}>2.อายุ:</Text>
            <Text style={styles.value}>{item.personalRequestReasonAge || "-"}</Text>

            <Text style={styles.label}>3.วุฒิการศึกษา:</Text>
            <Text style={styles.value}>{item.personalRequestReasonEducation || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>4.ความสามารถทางภาษาอังกฤษ:</Text>
            <Text style={styles.value}>{item.personalRequestReasonEnglishSkill || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>5.ความสามารถด้านคอมพิวเตอร์:</Text>
            <Text style={styles.value}>{item.personalRequestReasonComputerSkill || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>6.ความสามารถพิเศษอื่นๆ:</Text>
            <Text style={styles.value}>{item.personalRequestReasonOtherSkill || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>7.ความรู้ ความชำนาญ หรือประสบการณ์ที่ต้องการ:</Text>
            <Text style={styles.value}>{item.personalRequestReasonExperience || "-"}</Text>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>8.ลักษณะงาน และหน้าที่ความรับผิดชอบ  ( แนบใบกำหนดลักษณะงาน   Job  Description FM-HR3-01 ):</Text>
          </View>

          <View style={styles.textRow}>
            <View style={styles.textCol}>
                <View style={styles.textRow}>
                    <Text style={styles.label}>ลงชื่อ:</Text>
                    <Image
                        style={styles.signatureImage}
                        src={
                            item.PersonalRequestCreateBy?.employeeEmployment?.[0]?.employmentSignature
                            || "/default_signature.png" 
                        }
                    />
                    <Text style={styles.label}>ผู้ขอเสนอ:</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>(ผู้จัดการแผนก /ฝ่าย /หัวหน้างาน)</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>วันที่</Text>
                    <Text style={styles.value}> {new Date(item.personalRequestCreateAt).toLocaleDateString() || "-"}</Text>
                </View>
            </View>

            <View style={styles.textCol}>
                <View style={styles.textRow}>
                    <Text style={styles.label}>ลงชื่อ:</Text>
                    <Text style={styles.value}>{getFullName(item.PersonalRequestCreateBy) || "-"}</Text>
                    <Text style={styles.label}>รับทราบ:</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>(ผู้ช่วยผู้จัดการ / ผู้จัดการ)</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>วันที่</Text>
                    <Text style={styles.value}> {new Date(item.personalRequestCreateAt).toLocaleDateString() || "-"}</Text>
                </View>
            </View>
          </View>

          <View style={styles.textRow}>
            <View style={styles.textCol}>
                <View style={styles.textRow}>
                    <Text style={styles.label}>ลงชื่อ:</Text>
                    <Text style={styles.value}>{getFullName(item.PersonalRequestCreateBy) || "-"}</Text>
                    <Text style={styles.label}>รับทราบ:</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>(แผนกบุคคล)</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>วันที่</Text>
                    <Text style={styles.value}> {new Date(item.personalRequestCreateAt).toLocaleDateString() || "-"}</Text>
                </View>
            </View>

            <View style={styles.textCol}>
                <View style={styles.textRow}>
                    <Text style={styles.label}>ลงชื่อ:</Text>
                    <Text style={styles.value}>{getFullName(item.PersonalRequestCreateBy) || "-"}</Text>
                    <Text style={styles.label}>รับทราบ:</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>(รองกรรมการผู้จัดการ)</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.label}>วันที่</Text>
                    <Text style={styles.value}> {new Date(item.personalRequestCreateAt).toLocaleDateString() || "-"}</Text>
                </View>
            </View>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.label}>FM01-WP-HR1-01 / Rev.00 / 24-02-64</Text>
          </View>
        </View>

      </Page>
    </Document>
  );

  try {
    const blob = await pdf(<MyDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("Error exporting PDF");
  }
}
