import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";

export interface Report {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom hook for tactical role reports list and management
 */
export const useTacticalReports = (navigation: any) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    null
  );

  const ITEMS_PER_PAGE = 10;
  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  /**
   * Fetch reports from API
   */
  const fetchReports = useCallback(
    async (pageNumber = 1) => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }

      try {
        const response = await axiosInterceptor({
          url: "/v1/reports",
          method: "GET",
          params: {
            page: pageNumber,
            limit: ITEMS_PER_PAGE,
            type: selectedReportType || undefined,
          },
          token,
        });

        const newReports = response?.data?.records || [];

        if (pageNumber === 1) {
          setReports(newReports);
        } else {
          setReports((prev) => [...prev, ...newReports]);
        }

        setHasNextPage(newReports.length >= ITEMS_PER_PAGE);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.show({
          message: "Failed to load reports",
          preset: "error",
        });
      } finally {
        if (pageNumber === 1) {
          setIsLoading(false);
        } else {
          setIsFetchingNextPage(false);
        }
      }
    },
    [token, toast, selectedReportType]
  );

  /**
   * Create a new report
   */
  const createReport = useCallback(
    async (reportData: Partial<Report>, file?: any) => {
      if (!token) return null;

      setIsCreating(true);

      try {
        // Create the report
        const reportResponse = await axiosInterceptor({
          url: "/v1/reports",
          method: "POST",
          data: reportData,
          token,
        });

        const newReportId = reportResponse?.data?._id;

        // If file is provided, upload it
        if (file && newReportId) {
          const formData = new FormData();
          formData.append("file", file);

          await axiosInterceptor({
            url: `/v1/reports/${newReportId}/file`,
            method: "POST",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            token,
          });
        }

        // Refresh the reports list
        await fetchReports(1);

        toast.show({
          message: "Report created successfully",
        });

        return reportResponse?.data;
      } catch (error) {
        console.error("Error creating report:", error);
        toast.show({
          message: "Failed to create report",
          preset: "error",
        });
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [token, toast, fetchReports]
  );

  /**
   * Delete a report
   */
  const deleteReport = useCallback(
    async (reportId: string) => {
      if (!token) return false;

      try {
        await axiosInterceptor({
          url: `/v1/reports/${reportId}`,
          method: "DELETE",
          token,
        });

        // Remove report from state
        setReports((prevReports) =>
          prevReports.filter((report) => report._id !== reportId)
        );

        toast.show({
          message: "Report deleted successfully",
        });

        return true;
      } catch (error) {
        console.error("Error deleting report:", error);
        toast.show({
          message: "Failed to delete report",
          preset: "error",
        });
        return false;
      }
    },
    [token, toast]
  );

  /**
   * Download report file
   */
  const downloadReport = useCallback(
    async (reportId: string) => {
      if (!token) return null;

      try {
        const response = await axiosInterceptor({
          url: `/v1/reports/${reportId}/file`,
          method: "GET",
          token,
          responseType: "blob",
        });

        return response?.data;
      } catch (error) {
        console.error("Error downloading report:", error);
        toast.show({
          message: "Failed to download report",
          preset: "error",
        });
        return null;
      }
    },
    [token, toast]
  );

  /**
   * Navigate to report details
   */
  const navigateToReportDetails = useCallback(
    (reportId: string) => {
      navigation.navigate("ReportDetailsScreen", { reportId });
    },
    [navigation]
  );

  /**
   * Navigate to create report screen
   */
  const navigateToCreateReport = useCallback(() => {
    navigation.navigate("CreateReportScreen");
  }, [navigation]);

  /**
   * Handle report type filter change
   */
  const handleReportTypeChange = useCallback((type: string | null) => {
    setSelectedReportType(type);
    setPage(1);
  }, []);

  /**
   * Handle search query change
   */
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (query.trim() === "") {
        setFilteredReports(reports);
        return;
      }

      const filtered = reports.filter((report) =>
        report.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredReports(filtered);
    },
    [reports]
  );

  /**
   * Fetch next page of reports
   */
  const fetchNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const nextPage = page + 1;
    fetchReports(nextPage);
  }, [fetchReports, hasNextPage, isFetchingNextPage, page]);

  // Initialize filtered reports with all reports
  useEffect(() => {
    setFilteredReports(reports);
  }, [reports]);

  // Fetch initial data
  useEffect(() => {
    fetchReports(1);
  }, [fetchReports, selectedReportType]);

  // Apply search filter when reports change
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [reports, handleSearch, searchQuery]);

  return {
    reports: searchQuery ? filteredReports : reports,
    isLoading,
    isCreating,
    isFetchingNextPage,
    hasNextPage,
    searchQuery,
    selectedReportType,
    setSearchQuery: handleSearch,
    setSelectedReportType: handleReportTypeChange,
    fetchNextPage,
    createReport,
    deleteReport,
    downloadReport,
    navigateToReportDetails,
    navigateToCreateReport,
    refetch: () => fetchReports(1),
  };
};
