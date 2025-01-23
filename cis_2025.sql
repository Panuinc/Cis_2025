-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 23, 2025 at 10:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cis_2025`
--

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `branchId` int(11) NOT NULL,
  `branchName` varchar(255) NOT NULL,
  `branchStatus` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `branchCreateBy` int(11) NOT NULL,
  `branchCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `branchUpdateBy` int(11) DEFAULT NULL,
  `branchUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`branchId`, `branchName`, `branchStatus`, `branchCreateBy`, `branchCreateAt`, `branchUpdateBy`, `branchUpdateAt`) VALUES
(1, 'สาขา 1 (สำนักงานใหญ่)', 'Active', 1, '2025-01-22 02:11:23', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cv`
--

CREATE TABLE `cv` (
  `cvId` int(11) NOT NULL,
  `cvEmployeeId` int(11) NOT NULL,
  `cvCreateBy` int(11) NOT NULL,
  `cvCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `cvUpdateBy` int(11) DEFAULT NULL,
  `cvUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cv`
--

INSERT INTO `cv` (`cvId`, `cvEmployeeId`, `cvCreateBy`, `cvCreateAt`, `cvUpdateBy`, `cvUpdateAt`) VALUES
(1, 1, 1, '2025-01-22 02:10:22', NULL, NULL),
(2, 2, 1, '2025-01-22 02:24:27', NULL, NULL),
(3, 3, 1, '2025-01-22 02:28:35', NULL, NULL),
(4, 4, 1, '2025-01-22 02:31:28', NULL, NULL),
(5, 5, 1, '2025-01-22 02:34:44', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cveducation`
--

CREATE TABLE `cveducation` (
  `cvEducationId` int(11) NOT NULL,
  `cvEducationCvId` int(11) NOT NULL,
  `cvEducationDegree` varchar(255) DEFAULT NULL,
  `cvEducationInstitution` varchar(255) DEFAULT NULL,
  `cvEducationStartDate` varchar(255) DEFAULT NULL,
  `cvEducationEndDate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cvprofessionallicense`
--

CREATE TABLE `cvprofessionallicense` (
  `cvProfessionalLicenseId` int(11) NOT NULL,
  `cvProfessionalLicenseCvId` int(11) NOT NULL,
  `cvProfessionalLicenseName` varchar(255) DEFAULT NULL,
  `cvProfessionalLicenseNumber` varchar(255) DEFAULT NULL,
  `cvProfessionalLicenseStartDate` varchar(255) DEFAULT NULL,
  `cvProfessionalLicenseEndDate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cvproject`
--

CREATE TABLE `cvproject` (
  `cvProjectId` int(11) NOT NULL,
  `cvProjectWorkHistoryId` int(11) NOT NULL,
  `cvProjectName` varchar(255) DEFAULT NULL,
  `cvProjectDescription` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cvworkhistory`
--

CREATE TABLE `cvworkhistory` (
  `cvWorkHistoryId` int(11) NOT NULL,
  `cvWorkHistoryCvId` int(11) NOT NULL,
  `cvWorkHistoryCompanyName` varchar(255) DEFAULT NULL,
  `cvWorkHistoryPosition` varchar(255) DEFAULT NULL,
  `cvWorkHistoryStartDate` varchar(255) DEFAULT NULL,
  `cvWorkHistoryEndDate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `departmentId` int(11) NOT NULL,
  `departmentBranchId` int(11) NOT NULL,
  `departmentDivisionId` int(11) NOT NULL,
  `departmentName` varchar(255) NOT NULL,
  `departmentStatus` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `departmentCreateBy` int(11) NOT NULL,
  `departmentCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `departmentUpdateBy` int(11) DEFAULT NULL,
  `departmentUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`departmentId`, `departmentBranchId`, `departmentDivisionId`, `departmentName`, `departmentStatus`, `departmentCreateBy`, `departmentCreateAt`, `departmentUpdateBy`, `departmentUpdateAt`) VALUES
(1, 1, 1, 'พัฒนาโปรแกรม', 'Active', 1, '2025-01-22 02:15:00', NULL, NULL),
(2, 1, 2, 'บุคคล', 'Active', 1, '2025-01-22 02:15:11', NULL, NULL),
(3, 1, 3, 'บริหาร', 'Active', 1, '2025-01-22 02:15:22', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `division`
--

CREATE TABLE `division` (
  `divisionId` int(11) NOT NULL,
  `divisionBranchId` int(11) NOT NULL,
  `divisionName` varchar(255) NOT NULL,
  `divisionStatus` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `divisionCreateBy` int(11) NOT NULL,
  `divisionCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `divisionUpdateBy` int(11) DEFAULT NULL,
  `divisionUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `division`
--

INSERT INTO `division` (`divisionId`, `divisionBranchId`, `divisionName`, `divisionStatus`, `divisionCreateBy`, `divisionCreateAt`, `divisionUpdateBy`, `divisionUpdateAt`) VALUES
(1, 1, 'เทคโนโลยีสารสนเทศ', 'Active', 1, '2025-01-22 02:12:35', NULL, NULL),
(2, 1, 'บุคคล', 'Active', 1, '2025-01-22 02:12:52', NULL, NULL),
(3, 1, 'บริหาร', 'Active', 1, '2025-01-22 02:13:10', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `empdocument`
--

CREATE TABLE `empdocument` (
  `empDocumentId` int(11) NOT NULL,
  `empDocumentEmployeeId` int(11) NOT NULL,
  `empDocumentIdCardFile` varchar(255) DEFAULT NULL,
  `empDocumentHomeFile` varchar(255) DEFAULT NULL,
  `empDocumentSumFile` varchar(255) DEFAULT NULL,
  `empDocumentPassportFile` varchar(255) DEFAULT NULL,
  `empDocumentImmigrationFile` varchar(255) DEFAULT NULL,
  `empDocumentVisa1File` varchar(255) DEFAULT NULL,
  `empDocumentVisa2File` varchar(255) DEFAULT NULL,
  `empDocumentVisa3File` varchar(255) DEFAULT NULL,
  `empDocumentVisa4File` varchar(255) DEFAULT NULL,
  `empDocumentVisa5File` varchar(255) DEFAULT NULL,
  `empDocumentWorkPermit1File` varchar(255) DEFAULT NULL,
  `empDocumentWorkPermit2File` varchar(255) DEFAULT NULL,
  `empDocumentWorkPermit3File` varchar(255) DEFAULT NULL,
  `empDocumentWorkPermit4File` varchar(255) DEFAULT NULL,
  `empDocumentWorkPermit5File` varchar(255) DEFAULT NULL,
  `empDocumentCreateBy` int(11) NOT NULL,
  `empDocumentCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `empDocumentUpdateBy` int(11) DEFAULT NULL,
  `empDocumentUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `empdocument`
--

INSERT INTO `empdocument` (`empDocumentId`, `empDocumentEmployeeId`, `empDocumentIdCardFile`, `empDocumentHomeFile`, `empDocumentSumFile`, `empDocumentPassportFile`, `empDocumentImmigrationFile`, `empDocumentVisa1File`, `empDocumentVisa2File`, `empDocumentVisa3File`, `empDocumentVisa4File`, `empDocumentVisa5File`, `empDocumentWorkPermit1File`, `empDocumentWorkPermit2File`, `empDocumentWorkPermit3File`, `empDocumentWorkPermit4File`, `empDocumentWorkPermit5File`, `empDocumentCreateBy`, `empDocumentCreateAt`, `empDocumentUpdateBy`, `empDocumentUpdateAt`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-01-22 02:10:22', NULL, NULL),
(2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-01-22 02:24:27', NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-01-22 02:28:35', NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-01-22 02:31:28', NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-01-22 02:34:44', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employeeId` int(11) NOT NULL,
  `employeeTitle` enum('Mr','Mrs','Ms') NOT NULL,
  `employeeFirstname` varchar(255) NOT NULL,
  `employeeLastname` varchar(255) NOT NULL,
  `employeeNickname` varchar(255) NOT NULL,
  `employeeEmail` varchar(255) NOT NULL,
  `employeeTel` varchar(255) NOT NULL,
  `employeeIdCard` varchar(255) NOT NULL,
  `employeeBirthday` datetime(3) NOT NULL,
  `employeeCitizen` enum('Thai','Cambodian','Lao','Burmese','Vietnamese') NOT NULL,
  `employeeGender` enum('Male','FeMale') NOT NULL,
  `employeeLevel` enum('SuperAdmin','Admin','User') NOT NULL DEFAULT 'User',
  `employeeStatus` enum('Active','InActive') NOT NULL DEFAULT 'InActive',
  `employeeCreateBy` int(11) NOT NULL,
  `employeeCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `employeeUpdateBy` int(11) DEFAULT NULL,
  `employeeUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employeeId`, `employeeTitle`, `employeeFirstname`, `employeeLastname`, `employeeNickname`, `employeeEmail`, `employeeTel`, `employeeIdCard`, `employeeBirthday`, `employeeCitizen`, `employeeGender`, `employeeLevel`, `employeeStatus`, `employeeCreateBy`, `employeeCreateAt`, `employeeUpdateBy`, `employeeUpdateAt`) VALUES
(1, 'Mr', 'Admin', 'Cis', 'System', 'cis.channakorn@gmail.com', '1234567890', '1234567890123', '2025-01-01 00:00:00.000', 'Thai', 'Male', 'SuperAdmin', 'Active', 1, '2025-01-22 02:10:22', 1, '2025-01-22 09:24:51.000'),
(2, 'Mr', 'Manager IT', 'Manager IT', 'Manager IT', 'ManagerIT@gmail.com', '123456790', '123456790123', '2025-01-01 00:00:00.000', 'Thai', 'Male', 'Admin', 'Active', 1, '2025-01-22 02:24:27', 1, '2025-01-22 09:24:43.000'),
(3, 'Mr', 'Office IT', 'Office IT', 'Office IT', 'OfficeIT@gmail.com', '1234567890', '1234567890124', '2025-01-01 00:00:00.000', 'Thai', 'Male', 'Admin', 'Active', 1, '2025-01-22 02:28:35', 1, '2025-01-22 09:28:50.000'),
(4, 'Mr', 'Manager HR', 'Manager HR', 'Manager HR', 'ManagerHR@gmail.com', '1234567890', '1234567890125', '2025-01-01 00:00:00.000', 'Thai', 'Male', 'Admin', 'Active', 1, '2025-01-22 02:31:28', 1, '2025-01-22 09:31:38.000'),
(5, 'Mr', 'Managing Director MD', 'Managing Director MD', 'Managing Director MD', 'ManagingDirectorMD@gmail.com', '123456790', '123456790126', '2025-01-01 00:00:00.000', 'Thai', 'Male', 'Admin', 'Active', 1, '2025-01-22 02:34:44', 1, '2025-01-22 09:34:59.000');

-- --------------------------------------------------------

--
-- Table structure for table `employment`
--

CREATE TABLE `employment` (
  `employmentId` int(11) NOT NULL,
  `employmentEmployeeId` int(11) NOT NULL,
  `employmentNumber` varchar(255) DEFAULT NULL,
  `employmentCardNumber` varchar(255) DEFAULT NULL,
  `employmentType` enum('DAILY_WAGE','MONTHLY_SALARY','MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES') DEFAULT NULL,
  `employmentBranchId` int(11) DEFAULT NULL,
  `employmentSiteId` int(11) DEFAULT NULL,
  `employmentDivisionId` int(11) DEFAULT NULL,
  `employmentDepartmentId` int(11) DEFAULT NULL,
  `employmentPositionId` int(11) DEFAULT NULL,
  `employmentRoleId` int(11) DEFAULT NULL,
  `employmentParentId` int(11) DEFAULT NULL,
  `employmentStartWork` datetime(3) DEFAULT NULL,
  `employmentPicture` varchar(255) DEFAULT NULL,
  `employmentSignature` varchar(255) DEFAULT NULL,
  `employmentEnterType` varchar(255) DEFAULT NULL,
  `employmentPassportNumber` varchar(255) DEFAULT NULL,
  `employmentPassportStartDate` datetime(3) DEFAULT NULL,
  `employmentPassportEndDate` datetime(3) DEFAULT NULL,
  `employmentPassportIssuedBy` varchar(255) DEFAULT NULL,
  `employmentPlaceOfBirth` varchar(255) DEFAULT NULL,
  `employmentEnterCheckPoint` varchar(255) DEFAULT NULL,
  `employmentEnterDate` datetime(3) DEFAULT NULL,
  `employmentImmigration` varchar(255) DEFAULT NULL,
  `employmentTypeOfVisa` varchar(255) DEFAULT NULL,
  `employmentVisaNumber` varchar(255) DEFAULT NULL,
  `employmentVisaIssuedBy` varchar(255) DEFAULT NULL,
  `employmentWorkPermitNumber` varchar(255) DEFAULT NULL,
  `employmentWorkPermitStartDate` datetime(3) DEFAULT NULL,
  `employmentWorkPermitEndDate` datetime(3) DEFAULT NULL,
  `employmentWorkPermitIssuedBy` varchar(255) DEFAULT NULL,
  `employmentSsoNumber` varchar(255) DEFAULT NULL,
  `employmentSsoHospital` varchar(255) DEFAULT NULL,
  `employmentWorkStatus` enum('CurrentEmployee','Resign') DEFAULT 'CurrentEmployee',
  `employmentCreateBy` int(11) NOT NULL,
  `employmentCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `employmentUpdateBy` int(11) DEFAULT NULL,
  `employmentUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employment`
--

INSERT INTO `employment` (`employmentId`, `employmentEmployeeId`, `employmentNumber`, `employmentCardNumber`, `employmentType`, `employmentBranchId`, `employmentSiteId`, `employmentDivisionId`, `employmentDepartmentId`, `employmentPositionId`, `employmentRoleId`, `employmentParentId`, `employmentStartWork`, `employmentPicture`, `employmentSignature`, `employmentEnterType`, `employmentPassportNumber`, `employmentPassportStartDate`, `employmentPassportEndDate`, `employmentPassportIssuedBy`, `employmentPlaceOfBirth`, `employmentEnterCheckPoint`, `employmentEnterDate`, `employmentImmigration`, `employmentTypeOfVisa`, `employmentVisaNumber`, `employmentVisaIssuedBy`, `employmentWorkPermitNumber`, `employmentWorkPermitStartDate`, `employmentWorkPermitEndDate`, `employmentWorkPermitIssuedBy`, `employmentSsoNumber`, `employmentSsoHospital`, `employmentWorkStatus`, `employmentCreateBy`, `employmentCreateAt`, `employmentUpdateBy`, `employmentUpdateAt`) VALUES
(1, 1, 'Cis0000001', 'Cis0000001', 'MONTHLY_SALARY', 1, 1, 1, 1, 1, 2, 1, '2025-01-01 00:00:00.000', 'Cis0000001_1.png', 'Cis0000001_1.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CurrentEmployee', 1, '2025-01-22 02:10:22', 1, '2025-01-22 09:21:18.000'),
(2, 2, 'IT0000001', 'IT0000001', 'MONTHLY_SALARY', 1, 1, 1, 1, 1, 2, 2, '2025-01-01 00:00:00.000', 'IT0000001_2.png', 'IT0000001_2.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CurrentEmployee', 1, '2025-01-22 02:24:27', 1, '2025-01-22 09:27:03.000'),
(3, 3, 'IT0000002', 'IT0000002', 'MONTHLY_SALARY', 1, 1, 1, 1, 1, 3, 2, '2025-01-01 00:00:00.000', 'IT0000002_3.png', 'IT0000002_3.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CurrentEmployee', 1, '2025-01-22 02:28:35', 1, '2025-01-22 09:30:05.000'),
(4, 4, 'HR0000001', 'HR0000001', 'MONTHLY_SALARY', 1, 1, 2, 2, 2, 2, 4, '2025-01-01 00:00:00.000', 'HR0000001_4.png', 'HR0000001_4.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CurrentEmployee', 1, '2025-01-22 02:31:28', 1, '2025-01-22 09:33:30.000'),
(5, 5, 'MD0000001', 'MD0000001', 'MONTHLY_SALARY', 1, 1, 3, 3, 3, 1, 5, '2025-01-01 00:00:00.000', 'MD0000001_5.png', 'MD0000001_5.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CurrentEmployee', 1, '2025-01-22 02:34:44', 1, '2025-01-22 09:38:15.000');

-- --------------------------------------------------------

--
-- Table structure for table `personalrequest`
--

CREATE TABLE `personalrequest` (
  `personalRequestId` int(11) NOT NULL,
  `personalRequestDocumentId` varchar(255) NOT NULL,
  `personalRequestAmount` int(11) NOT NULL,
  `personalRequestBranchId` int(11) NOT NULL,
  `personalRequestDivisionId` int(11) NOT NULL,
  `personalRequestDepartmentId` int(11) NOT NULL,
  `personalRequestPositionId` int(11) NOT NULL,
  `personalRequestDesiredDate` datetime(3) NOT NULL,
  `personalRequestEmploymentType` enum('FULL_TIME','PART_TIME','TEMPORARY','CONTRACT','INTERN') NOT NULL,
  `personalRequestReasonForRequest` enum('REPLACE_STAFF','NEW_POSITION','EXPANSION','OTHER') NOT NULL,
  `personalRequestReasonGender` enum('Male','FeMale') NOT NULL,
  `personalRequestReasonAge` varchar(255) NOT NULL,
  `personalRequestReasonEducation` varchar(255) NOT NULL,
  `personalRequestReasonEnglishSkill` enum('BASIC','INTERMEDIATE','ADVANCED') NOT NULL,
  `personalRequestReasonComputerSkill` enum('BASIC','INTERMEDIATE','ADVANCED') NOT NULL,
  `personalRequestReasonOtherSkill` varchar(255) NOT NULL,
  `personalRequestReasonExperience` varchar(255) NOT NULL,
  `personalRequestStatus` enum('PendingManagerApprove','ManagerCancel','PendingHrApprove','HrCancel','PendingMdApprove','MdCancel','ApprovedSuccess','Cancel') NOT NULL DEFAULT 'PendingManagerApprove',
  `personalRequestCreateBy` int(11) NOT NULL,
  `personalRequestCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `personalRequestUpdateBy` int(11) DEFAULT NULL,
  `personalRequestUpdateAt` datetime(3) DEFAULT NULL,
  `personalRequestReasonManagerApproveBy` int(11) DEFAULT NULL,
  `personalRequestReasonManagerApproveAt` datetime(3) DEFAULT NULL,
  `personalRequestReasonHrApproveBy` int(11) DEFAULT NULL,
  `personalRequestReasonHrApproveAt` datetime(3) DEFAULT NULL,
  `personalRequestReasonMdApproveBy` int(11) DEFAULT NULL,
  `personalRequestReasonMdApproveAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personalrequest`
--

INSERT INTO `personalrequest` (`personalRequestId`, `personalRequestDocumentId`, `personalRequestAmount`, `personalRequestBranchId`, `personalRequestDivisionId`, `personalRequestDepartmentId`, `personalRequestPositionId`, `personalRequestDesiredDate`, `personalRequestEmploymentType`, `personalRequestReasonForRequest`, `personalRequestReasonGender`, `personalRequestReasonAge`, `personalRequestReasonEducation`, `personalRequestReasonEnglishSkill`, `personalRequestReasonComputerSkill`, `personalRequestReasonOtherSkill`, `personalRequestReasonExperience`, `personalRequestStatus`, `personalRequestCreateBy`, `personalRequestCreateAt`, `personalRequestUpdateBy`, `personalRequestUpdateAt`, `personalRequestReasonManagerApproveBy`, `personalRequestReasonManagerApproveAt`, `personalRequestReasonHrApproveBy`, `personalRequestReasonHrApproveAt`, `personalRequestReasonMdApproveBy`, `personalRequestReasonMdApproveAt`) VALUES
(1, 'PR-22/01/2025-01', 1, 1, 1, 1, 1, '2025-02-01 00:00:00.000', 'FULL_TIME', 'REPLACE_STAFF', 'Male', '30', 'Test', 'BASIC', 'BASIC', 'Test', 'Test', 'MdCancel', 3, '2025-01-22 02:41:41', 3, '2025-01-23 16:26:44.000', 2, '2025-01-23 14:27:35.000', 4, '2025-01-23 14:27:42.000', 5, '2025-01-23 14:27:48.000');

-- --------------------------------------------------------

--
-- Table structure for table `position`
--

CREATE TABLE `position` (
  `positionId` int(11) NOT NULL,
  `positionBranchId` int(11) NOT NULL,
  `positionDivisionId` int(11) NOT NULL,
  `positionDepartmentId` int(11) NOT NULL,
  `positionName` varchar(255) NOT NULL,
  `positionStatus` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `positionCreateBy` int(11) NOT NULL,
  `positionCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `positionUpdateBy` int(11) DEFAULT NULL,
  `positionUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `position`
--

INSERT INTO `position` (`positionId`, `positionBranchId`, `positionDivisionId`, `positionDepartmentId`, `positionName`, `positionStatus`, `positionCreateBy`, `positionCreateAt`, `positionUpdateBy`, `positionUpdateAt`) VALUES
(1, 1, 1, 1, 'เจ้าหน้าที่พัฒนาโปรแกรม', 'Active', 1, '2025-01-22 02:15:44', NULL, NULL),
(2, 1, 2, 2, 'เจ้าหน้าที่บุคคล', 'Active', 1, '2025-01-22 02:15:56', NULL, NULL),
(3, 1, 3, 3, 'เจ้าหน้าที่บริหาร', 'Active', 1, '2025-01-22 02:16:20', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `resume`
--

CREATE TABLE `resume` (
  `resumeId` int(11) NOT NULL,
  `resumeEmployeeId` int(11) NOT NULL,
  `resumeLink` varchar(255) DEFAULT NULL,
  `resumeCreateBy` int(11) NOT NULL,
  `resumeCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `resumeUpdateBy` int(11) DEFAULT NULL,
  `resumeUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `resume`
--

INSERT INTO `resume` (`resumeId`, `resumeEmployeeId`, `resumeLink`, `resumeCreateBy`, `resumeCreateAt`, `resumeUpdateBy`, `resumeUpdateAt`) VALUES
(1, 1, NULL, 1, '2025-01-22 02:10:22', NULL, NULL),
(2, 2, NULL, 1, '2025-01-22 02:24:27', NULL, NULL),
(3, 3, NULL, 1, '2025-01-22 02:28:35', NULL, NULL),
(4, 4, NULL, 1, '2025-01-22 02:31:28', NULL, NULL),
(5, 5, NULL, 1, '2025-01-22 02:34:44', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  `roleStatus` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `roleCreateBy` int(11) NOT NULL,
  `roleCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `roleUpdateBy` int(11) DEFAULT NULL,
  `roleUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`roleId`, `roleName`, `roleStatus`, `roleCreateBy`, `roleCreateAt`, `roleUpdateBy`, `roleUpdateAt`) VALUES
(1, 'Managing Director', 'Active', 1, '2025-01-22 02:11:53', NULL, NULL),
(2, 'Manager', 'Active', 1, '2025-01-22 02:16:40', NULL, NULL),
(3, 'Office', 'Active', 1, '2025-01-22 02:17:51', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `site`
--

CREATE TABLE `site` (
  `siteId` int(11) NOT NULL,
  `siteBranchId` int(11) NOT NULL,
  `siteName` varchar(255) NOT NULL,
  `siteStatus` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `siteCreateBy` int(11) NOT NULL,
  `siteCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `siteUpdateBy` int(11) DEFAULT NULL,
  `siteUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site`
--

INSERT INTO `site` (`siteId`, `siteBranchId`, `siteName`, `siteStatus`, `siteCreateBy`, `siteCreateAt`, `siteUpdateBy`, `siteUpdateAt`) VALUES
(1, 1, 'สำนักงานใหญ่', 'Active', 1, '2025-01-22 02:12:14', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `userEmployeeId` int(11) NOT NULL,
  `userUsername` varchar(255) DEFAULT NULL,
  `userPassword` varchar(255) DEFAULT NULL,
  `userCreateBy` int(11) NOT NULL,
  `userCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `userUpdateBy` int(11) DEFAULT NULL,
  `userUpdateAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userEmployeeId`, `userUsername`, `userPassword`, `userCreateBy`, `userCreateAt`, `userUpdateBy`, `userUpdateAt`) VALUES
(1, 1, 'Admin.Cis', '$2a$12$AxDC4kGRjEmroRqu46bcMOYSVIHjf8WuIW6QoFHAGcNX1FPRNq9vi', 1, '2025-01-22 02:10:22', NULL, NULL),
(2, 2, 'ManagerIT', '$2a$12$elGo/nn7usORUiAPVgh9se26EhzoORsqmyo1/bSLKmCVRi9uBufTq', 1, '2025-01-22 02:24:27', 1, '2025-01-22 09:25:21.000'),
(3, 3, 'OfficeIT', '$2a$12$JAVSLBbs.Iqvi0iAPX/f/umcjdplWUWRM4AYkrc9Z3z9eTtcEXk0u', 1, '2025-01-22 02:28:35', 1, '2025-01-22 09:29:08.000'),
(4, 4, 'ManagerHR', '$2a$12$jTrOZfBBeGGTsQtI5POX5.ErkJ3pR1HHRDDAo6X7zjq4qrITa3wva', 1, '2025-01-22 02:31:28', 1, '2025-01-22 09:39:29.000'),
(5, 5, 'MD', '$2a$12$.h7XvKqQYl9xeHvlWfcBo.URlejzQ9eifsvPCzqUns0gpCqXDp27.', 1, '2025-01-22 02:34:44', 1, '2025-01-22 09:39:42.000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`branchId`),
  ADD KEY `Branch_branchCreateBy_idx` (`branchCreateBy`),
  ADD KEY `Branch_branchUpdateBy_idx` (`branchUpdateBy`);

--
-- Indexes for table `cv`
--
ALTER TABLE `cv`
  ADD PRIMARY KEY (`cvId`),
  ADD KEY `Cv_cvEmployeeId_idx` (`cvEmployeeId`),
  ADD KEY `Cv_cvCreateBy_idx` (`cvCreateBy`),
  ADD KEY `Cv_cvUpdateBy_idx` (`cvUpdateBy`);

--
-- Indexes for table `cveducation`
--
ALTER TABLE `cveducation`
  ADD PRIMARY KEY (`cvEducationId`),
  ADD KEY `CvEducation_cvEducationCvId_idx` (`cvEducationCvId`);

--
-- Indexes for table `cvprofessionallicense`
--
ALTER TABLE `cvprofessionallicense`
  ADD PRIMARY KEY (`cvProfessionalLicenseId`),
  ADD KEY `CvProfessionalLicense_cvProfessionalLicenseCvId_idx` (`cvProfessionalLicenseCvId`);

--
-- Indexes for table `cvproject`
--
ALTER TABLE `cvproject`
  ADD PRIMARY KEY (`cvProjectId`),
  ADD KEY `CvProject_cvProjectWorkHistoryId_idx` (`cvProjectWorkHistoryId`);

--
-- Indexes for table `cvworkhistory`
--
ALTER TABLE `cvworkhistory`
  ADD PRIMARY KEY (`cvWorkHistoryId`),
  ADD KEY `CvWorkHistory_cvWorkHistoryCvId_idx` (`cvWorkHistoryCvId`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`departmentId`),
  ADD KEY `Department_departmentBranchId_idx` (`departmentBranchId`),
  ADD KEY `Department_departmentDivisionId_idx` (`departmentDivisionId`),
  ADD KEY `Department_departmentCreateBy_idx` (`departmentCreateBy`),
  ADD KEY `Department_departmentUpdateBy_idx` (`departmentUpdateBy`);

--
-- Indexes for table `division`
--
ALTER TABLE `division`
  ADD PRIMARY KEY (`divisionId`),
  ADD KEY `Division_divisionBranchId_idx` (`divisionBranchId`),
  ADD KEY `Division_divisionCreateBy_idx` (`divisionCreateBy`),
  ADD KEY `Division_divisionUpdateBy_idx` (`divisionUpdateBy`);

--
-- Indexes for table `empdocument`
--
ALTER TABLE `empdocument`
  ADD PRIMARY KEY (`empDocumentId`),
  ADD KEY `EmpDocument_empDocumentEmployeeId_idx` (`empDocumentEmployeeId`),
  ADD KEY `EmpDocument_empDocumentCreateBy_idx` (`empDocumentCreateBy`),
  ADD KEY `EmpDocument_empDocumentUpdateBy_idx` (`empDocumentUpdateBy`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employeeId`),
  ADD KEY `Employee_employeeCreateBy_idx` (`employeeCreateBy`),
  ADD KEY `Employee_employeeUpdateBy_idx` (`employeeUpdateBy`);

--
-- Indexes for table `employment`
--
ALTER TABLE `employment`
  ADD PRIMARY KEY (`employmentId`),
  ADD KEY `Employment_employmentEmployeeId_idx` (`employmentEmployeeId`),
  ADD KEY `Employment_employmentBranchId_idx` (`employmentBranchId`),
  ADD KEY `Employment_employmentSiteId_idx` (`employmentSiteId`),
  ADD KEY `Employment_employmentDivisionId_idx` (`employmentDivisionId`),
  ADD KEY `Employment_employmentDepartmentId_idx` (`employmentDepartmentId`),
  ADD KEY `Employment_employmentPositionId_idx` (`employmentPositionId`),
  ADD KEY `Employment_employmentRoleId_idx` (`employmentRoleId`),
  ADD KEY `Employment_employmentParentId_idx` (`employmentParentId`),
  ADD KEY `Employment_employmentCreateBy_idx` (`employmentCreateBy`),
  ADD KEY `Employment_employmentUpdateBy_idx` (`employmentUpdateBy`);

--
-- Indexes for table `personalrequest`
--
ALTER TABLE `personalrequest`
  ADD PRIMARY KEY (`personalRequestId`),
  ADD KEY `PersonalRequest_personalRequestCreateBy_idx` (`personalRequestCreateBy`),
  ADD KEY `PersonalRequest_personalRequestUpdateBy_idx` (`personalRequestUpdateBy`),
  ADD KEY `PersonalRequest_personalRequestReasonManagerApproveBy_idx` (`personalRequestReasonManagerApproveBy`),
  ADD KEY `PersonalRequest_personalRequestReasonHrApproveBy_idx` (`personalRequestReasonHrApproveBy`),
  ADD KEY `PersonalRequest_personalRequestReasonMdApproveBy_idx` (`personalRequestReasonMdApproveBy`),
  ADD KEY `PersonalRequest_personalRequestBranchId_idx` (`personalRequestBranchId`),
  ADD KEY `PersonalRequest_personalRequestDivisionId_idx` (`personalRequestDivisionId`),
  ADD KEY `PersonalRequest_personalRequestDepartmentId_idx` (`personalRequestDepartmentId`),
  ADD KEY `PersonalRequest_personalRequestPositionId_idx` (`personalRequestPositionId`);

--
-- Indexes for table `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`positionId`),
  ADD KEY `Position_positionBranchId_idx` (`positionBranchId`),
  ADD KEY `Position_positionDivisionId_idx` (`positionDivisionId`),
  ADD KEY `Position_positionDepartmentId_idx` (`positionDepartmentId`),
  ADD KEY `Position_positionCreateBy_idx` (`positionCreateBy`),
  ADD KEY `Position_positionUpdateBy_idx` (`positionUpdateBy`);

--
-- Indexes for table `resume`
--
ALTER TABLE `resume`
  ADD PRIMARY KEY (`resumeId`),
  ADD KEY `Resume_resumeEmployeeId_idx` (`resumeEmployeeId`),
  ADD KEY `Resume_resumeCreateBy_idx` (`resumeCreateBy`),
  ADD KEY `Resume_resumeUpdateBy_idx` (`resumeUpdateBy`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleId`),
  ADD KEY `Role_roleCreateBy_idx` (`roleCreateBy`),
  ADD KEY `Role_roleUpdateBy_idx` (`roleUpdateBy`);

--
-- Indexes for table `site`
--
ALTER TABLE `site`
  ADD PRIMARY KEY (`siteId`),
  ADD KEY `Site_siteBranchId_idx` (`siteBranchId`),
  ADD KEY `Site_siteCreateBy_idx` (`siteCreateBy`),
  ADD KEY `Site_siteUpdateBy_idx` (`siteUpdateBy`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `User_userEmployeeId_idx` (`userEmployeeId`),
  ADD KEY `User_userCreateBy_idx` (`userCreateBy`),
  ADD KEY `User_userUpdateBy_idx` (`userUpdateBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `branchId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cv`
--
ALTER TABLE `cv`
  MODIFY `cvId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cveducation`
--
ALTER TABLE `cveducation`
  MODIFY `cvEducationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cvprofessionallicense`
--
ALTER TABLE `cvprofessionallicense`
  MODIFY `cvProfessionalLicenseId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cvproject`
--
ALTER TABLE `cvproject`
  MODIFY `cvProjectId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cvworkhistory`
--
ALTER TABLE `cvworkhistory`
  MODIFY `cvWorkHistoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `departmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `division`
--
ALTER TABLE `division`
  MODIFY `divisionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `empdocument`
--
ALTER TABLE `empdocument`
  MODIFY `empDocumentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `employeeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employment`
--
ALTER TABLE `employment`
  MODIFY `employmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personalrequest`
--
ALTER TABLE `personalrequest`
  MODIFY `personalRequestId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `position`
--
ALTER TABLE `position`
  MODIFY `positionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resume`
--
ALTER TABLE `resume`
  MODIFY `resumeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `site`
--
ALTER TABLE `site`
  MODIFY `siteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `Branch_branchCreateBy_fkey` FOREIGN KEY (`branchCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Branch_branchUpdateBy_fkey` FOREIGN KEY (`branchUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cv`
--
ALTER TABLE `cv`
  ADD CONSTRAINT `Cv_cvCreateBy_fkey` FOREIGN KEY (`cvCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Cv_cvEmployeeId_fkey` FOREIGN KEY (`cvEmployeeId`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Cv_cvUpdateBy_fkey` FOREIGN KEY (`cvUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cveducation`
--
ALTER TABLE `cveducation`
  ADD CONSTRAINT `CvEducation_cvEducationCvId_fkey` FOREIGN KEY (`cvEducationCvId`) REFERENCES `cv` (`cvId`) ON UPDATE CASCADE;

--
-- Constraints for table `cvprofessionallicense`
--
ALTER TABLE `cvprofessionallicense`
  ADD CONSTRAINT `CvProfessionalLicense_cvProfessionalLicenseCvId_fkey` FOREIGN KEY (`cvProfessionalLicenseCvId`) REFERENCES `cv` (`cvId`) ON UPDATE CASCADE;

--
-- Constraints for table `cvproject`
--
ALTER TABLE `cvproject`
  ADD CONSTRAINT `CvProject_cvProjectWorkHistoryId_fkey` FOREIGN KEY (`cvProjectWorkHistoryId`) REFERENCES `cvworkhistory` (`cvWorkHistoryId`) ON UPDATE CASCADE;

--
-- Constraints for table `cvworkhistory`
--
ALTER TABLE `cvworkhistory`
  ADD CONSTRAINT `CvWorkHistory_cvWorkHistoryCvId_fkey` FOREIGN KEY (`cvWorkHistoryCvId`) REFERENCES `cv` (`cvId`) ON UPDATE CASCADE;

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `Department_departmentBranchId_fkey` FOREIGN KEY (`departmentBranchId`) REFERENCES `branch` (`branchId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Department_departmentCreateBy_fkey` FOREIGN KEY (`departmentCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Department_departmentDivisionId_fkey` FOREIGN KEY (`departmentDivisionId`) REFERENCES `division` (`divisionId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Department_departmentUpdateBy_fkey` FOREIGN KEY (`departmentUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `division`
--
ALTER TABLE `division`
  ADD CONSTRAINT `Division_divisionBranchId_fkey` FOREIGN KEY (`divisionBranchId`) REFERENCES `branch` (`branchId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Division_divisionCreateBy_fkey` FOREIGN KEY (`divisionCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Division_divisionUpdateBy_fkey` FOREIGN KEY (`divisionUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `empdocument`
--
ALTER TABLE `empdocument`
  ADD CONSTRAINT `EmpDocument_empDocumentCreateBy_fkey` FOREIGN KEY (`empDocumentCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `EmpDocument_empDocumentEmployeeId_fkey` FOREIGN KEY (`empDocumentEmployeeId`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `EmpDocument_empDocumentUpdateBy_fkey` FOREIGN KEY (`empDocumentUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `Employee_employeeCreateBy_fkey` FOREIGN KEY (`employeeCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Employee_employeeUpdateBy_fkey` FOREIGN KEY (`employeeUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `employment`
--
ALTER TABLE `employment`
  ADD CONSTRAINT `Employment_employmentBranchId_fkey` FOREIGN KEY (`employmentBranchId`) REFERENCES `branch` (`branchId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentCreateBy_fkey` FOREIGN KEY (`employmentCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentDepartmentId_fkey` FOREIGN KEY (`employmentDepartmentId`) REFERENCES `department` (`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentDivisionId_fkey` FOREIGN KEY (`employmentDivisionId`) REFERENCES `division` (`divisionId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentEmployeeId_fkey` FOREIGN KEY (`employmentEmployeeId`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentParentId_fkey` FOREIGN KEY (`employmentParentId`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentPositionId_fkey` FOREIGN KEY (`employmentPositionId`) REFERENCES `position` (`positionId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentRoleId_fkey` FOREIGN KEY (`employmentRoleId`) REFERENCES `role` (`roleId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentSiteId_fkey` FOREIGN KEY (`employmentSiteId`) REFERENCES `site` (`siteId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Employment_employmentUpdateBy_fkey` FOREIGN KEY (`employmentUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `personalrequest`
--
ALTER TABLE `personalrequest`
  ADD CONSTRAINT `PersonalRequest_personalRequestBranchId_fkey` FOREIGN KEY (`personalRequestBranchId`) REFERENCES `branch` (`branchId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestCreateBy_fkey` FOREIGN KEY (`personalRequestCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestDepartmentId_fkey` FOREIGN KEY (`personalRequestDepartmentId`) REFERENCES `department` (`departmentId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestDivisionId_fkey` FOREIGN KEY (`personalRequestDivisionId`) REFERENCES `division` (`divisionId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestPositionId_fkey` FOREIGN KEY (`personalRequestPositionId`) REFERENCES `position` (`positionId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestReasonHrApproveBy_fkey` FOREIGN KEY (`personalRequestReasonHrApproveBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestReasonManagerApproveBy_fkey` FOREIGN KEY (`personalRequestReasonManagerApproveBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestReasonMdApproveBy_fkey` FOREIGN KEY (`personalRequestReasonMdApproveBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalRequest_personalRequestUpdateBy_fkey` FOREIGN KEY (`personalRequestUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `position`
--
ALTER TABLE `position`
  ADD CONSTRAINT `Position_positionBranchId_fkey` FOREIGN KEY (`positionBranchId`) REFERENCES `branch` (`branchId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Position_positionCreateBy_fkey` FOREIGN KEY (`positionCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Position_positionDepartmentId_fkey` FOREIGN KEY (`positionDepartmentId`) REFERENCES `department` (`departmentId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Position_positionDivisionId_fkey` FOREIGN KEY (`positionDivisionId`) REFERENCES `division` (`divisionId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Position_positionUpdateBy_fkey` FOREIGN KEY (`positionUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `resume`
--
ALTER TABLE `resume`
  ADD CONSTRAINT `Resume_resumeCreateBy_fkey` FOREIGN KEY (`resumeCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Resume_resumeEmployeeId_fkey` FOREIGN KEY (`resumeEmployeeId`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Resume_resumeUpdateBy_fkey` FOREIGN KEY (`resumeUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `role`
--
ALTER TABLE `role`
  ADD CONSTRAINT `Role_roleCreateBy_fkey` FOREIGN KEY (`roleCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Role_roleUpdateBy_fkey` FOREIGN KEY (`roleUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `site`
--
ALTER TABLE `site`
  ADD CONSTRAINT `Site_siteBranchId_fkey` FOREIGN KEY (`siteBranchId`) REFERENCES `branch` (`branchId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Site_siteCreateBy_fkey` FOREIGN KEY (`siteCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Site_siteUpdateBy_fkey` FOREIGN KEY (`siteUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_userCreateBy_fkey` FOREIGN KEY (`userCreateBy`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `User_userEmployeeId_fkey` FOREIGN KEY (`userEmployeeId`) REFERENCES `employee` (`employeeId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `User_userUpdateBy_fkey` FOREIGN KEY (`userUpdateBy`) REFERENCES `employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
