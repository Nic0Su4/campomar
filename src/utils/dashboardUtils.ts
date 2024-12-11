import axios from "axios";

export const fetchEarnings = async (
  startDate?: string,
  endDate?: string
): Promise<number> => {
  const { data } = await axios.get("/api/dashboard/earnings", {
    params: { startDate, endDate },
  });
  return data.earnings;
};

export const fetchTopSellingDishes = async (
  startDate?: string,
  endDate?: string
): Promise<{ dish: string; totalSold: number }[]> => {
  const { data } = await axios.get("/api/dashboard/top-dishes", {
    params: { startDate, endDate },
  });
  return data.topDishes;
};
