import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);

export const formatDate = (date: string) => dayjs(date).format("D MMM YYYY");

export const formatCurrentDate = () => dayjs().format("dddd, D [de] MMMM");

export const getVariationLabel = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPercent(value)}`;
};

export const calculateProgress = (current: number, target: number) =>
  target === 0 ? 0 : Math.min(Math.round((current / target) * 100), 100);
