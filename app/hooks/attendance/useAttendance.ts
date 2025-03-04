import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";
import moment from "moment";

export interface AttendanceRecord {
  _id: string;
  player: {
    _id: string;
    name: string;
    shirtNumber: string;
    position: string;
    profileImage?: string;
  };
  date: string;
  timeIn: string;
  timeOut?: string;
  session: string;
  present: boolean;
}

export interface AttendanceHistory {
  date: string;
  day: string;
  timeIn: string;
  session: string;
  leave: string;
  backgroundColor?: string;
}

/**
 * Hook for fetching and managing attendance data
 */
export const useAttendance = (navigation: any) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const ITEMS_PER_PAGE = 15;

  // Fetch attendance records
  const fetchAttendance = useCallback(
    async (pageNum: number = 1) => {
      if (!token) return;

      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }

      try {
        // Format date for API
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

        // Make API request
        const response = await axiosInterceptor({
          url: "/v1/attendances",
          method: "GET",
          params: {
            date: formattedDate,
            page: pageNum,
            limit: ITEMS_PER_PAGE,
            search: searchQuery || undefined,
          },
          token,
        });

        const records = response?.data?.records || [];

        if (pageNum === 1) {
          setAttendance(records);
        } else {
          setAttendance((prev) => [...prev, ...records]);
        }

        setHasNextPage(records.length >= ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.show({
          message: "Failed to load attendance records",
          preset: "error",
        });
      } finally {
        if (pageNum === 1) {
          setIsLoading(false);
        } else {
          setIsFetchingNextPage(false);
        }
      }
    },
    [token, selectedDate, searchQuery, toast]
  );

  // Handle date change
  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setPage(1);
      // Refresh attendance with new date
      fetchAttendance(1);
    },
    [fetchAttendance]
  );

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setPage(1);
      // Refresh attendance with search query
      fetchAttendance(1);
    },
    [fetchAttendance]
  );

  // Handle fetching the next page
  const fetchNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchAttendance(page + 1);
  }, [fetchAttendance, hasNextPage, isFetchingNextPage, page]);

  // Navigate to player attendance profile
  const navigateToAttendanceProfile = useCallback(
    (playerId: string) => {
      navigation.navigate("AttendanceProfile", { playerId });
    },
    [navigation]
  );

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendance,
    isLoading,
    selectedDate,
    searchQuery,
    hasNextPage,
    isFetchingNextPage,
    handleDateChange,
    handleSearch,
    fetchNextPage,
    navigateToAttendanceProfile,
    refetch: () => fetchAttendance(1),
  };
};

/**
 * Hook for fetching and displaying a player's attendance history
 */
export const usePlayerAttendance = (playerId: string) => {
  const [playerDetails, setPlayerDetails] = useState<any>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceHistory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  // Fetch player details and attendance history
  const fetchPlayerAttendance = useCallback(async () => {
    if (!token || !playerId) return;

    setIsLoading(true);

    try {
      // Fetch player details
      const playerResponse = await axiosInterceptor({
        url: `/v1/players/${playerId}`,
        method: "GET",
        token,
      });

      setPlayerDetails(playerResponse?.data);

      // Fetch player attendance history
      const attendanceResponse = await axiosInterceptor({
        url: `/v1/players/${playerId}/attendance`,
        method: "GET",
        token,
      });

      if (attendanceResponse?.data?.records) {
        // Format attendance records
        const formattedHistory = attendanceResponse.data.records.map(
          (record: any, index: number) => ({
            date: [
              moment(record.date).format("DD"),
              moment(record.date).format("MMM"),
            ],
            day: moment(record.date).format("ddd"),
            timeIn: record.timeIn,
            session: record.session || "N/A",
            leave: record.timeOut || "N/A",
            backgroundColor: index % 2 === 0 ? color.blackbg : color.background,
          })
        );

        setAttendanceHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Error fetching player attendance:", error);
      toast.show({
        message: "Failed to load player attendance history",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, playerId, toast]);

  // Fetch data on mount
  useEffect(() => {
    fetchPlayerAttendance();
  }, [fetchPlayerAttendance]);

  return {
    playerDetails,
    attendanceHistory,
    isLoading,
    refetch: fetchPlayerAttendance,
  };
};

// Import color to avoid separate styles
const color = {
  blackbg: "#1E1E1E",
  background: "#121212",
  text: "#FFFFFF",
  primary: "#3F95FF",
  line: "#555555",
};
