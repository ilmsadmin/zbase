/**
 * Format một giá trị số thành định dạng tiền tệ VND
 * @param value Giá trị cần format
 * @returns Chuỗi định dạng tiền tệ
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Format một timestamp thành chuỗi ngày tháng
 * @param date Đối tượng Date hoặc timestamp
 * @param format Định dạng mong muốn ('short', 'medium', 'long', hoặc 'full')
 * @returns Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: format,
  };
  
  return new Intl.DateTimeFormat('vi-VN', options).format(dateObj);
};

/**
 * Rút gọn một chuỗi nếu nó dài hơn maxLength
 * @param text Chuỗi đầu vào
 * @param maxLength Độ dài tối đa mong muốn
 * @returns Chuỗi đã được rút gọn
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Tạo một chuỗi slug từ một chuỗi text
 * @param text Chuỗi đầu vào
 * @returns Chuỗi slug
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD') // Chuyển đổi dấu thành ký tự riêng biệt
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, '') // Loại bỏ các ký tự không phải chữ cái, số
    .replace(/--+/g, '-'); // Loại bỏ nhiều dấu gạch ngang liên tiếp
};

/**
 * Tạo một mã ngẫu nhiên với độ dài cho trước
 * @param length Độ dài mã mong muốn
 * @returns Chuỗi mã ngẫu nhiên
 */
export const generateRandomCode = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Chuyển đổi đường dẫn tương đối thành tuyệt đối
 * @param path Đường dẫn tương đối
 * @returns Đường dẫn tuyệt đối
 */
export const getAbsolutePath = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${baseUrl}${path}`;
};

/**
 * Trì hoãn thực thi một khoảng thời gian
 * @param ms Thời gian trì hoãn (ms)
 * @returns Promise
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
