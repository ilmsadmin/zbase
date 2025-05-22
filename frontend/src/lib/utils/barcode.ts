// Utility functions for barcode handling

/**
 * Supported barcode formats
 */
export enum BarcodeFormat {
  EAN13 = 'EAN-13',
  UPCA = 'UPC-A',
  UPCE = 'UPC-E',
  CODE128 = 'CODE-128',
  CODE39 = 'CODE-39',
  ITF = 'ITF',
  QR = 'QR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Interface for barcode validation results
 */
export interface BarcodeValidationResult {
  isValid: boolean;
  format: BarcodeFormat;
  message?: string;
}

/**
 * Format-specific validation functions
 */
const validators = {
  /**
   * Validates EAN-13 barcodes
   * EAN-13: 13 digits with the last digit being a check digit
   */
  [BarcodeFormat.EAN13]: (barcode: string): BarcodeValidationResult => {
    if (!/^\d{13}$/.test(barcode)) {
      return {
        isValid: false,
        format: BarcodeFormat.EAN13,
        message: 'EAN-13 barcode must be exactly 13 digits'
      };
    }

    // Check digit validation using modulo-10 algorithm
    const digits = barcode.split('').map(Number);
    const checksum = digits.pop() as number;
    
    const sum = digits.reduce((acc, digit, i) => {
      return acc + digit * (i % 2 === 0 ? 1 : 3);
    }, 0);
    
    const calculatedChecksum = (10 - (sum % 10)) % 10;
    
    return {
      isValid: checksum === calculatedChecksum,
      format: BarcodeFormat.EAN13,
      message: checksum !== calculatedChecksum ? 'EAN-13 check digit is invalid' : undefined
    };
  },

  /**
   * Validates UPC-A barcodes
   * UPC-A: 12 digits with the last digit being a check digit
   */
  [BarcodeFormat.UPCA]: (barcode: string): BarcodeValidationResult => {
    if (!/^\d{12}$/.test(barcode)) {
      return {
        isValid: false,
        format: BarcodeFormat.UPCA,
        message: 'UPC-A barcode must be exactly 12 digits'
      };
    }
    
    // Check digit validation using modulo-10 algorithm
    const digits = barcode.split('').map(Number);
    const checksum = digits.pop() as number;
    
    // UPC-A calculation: (odd positions * 3) + even positions
    const sum = digits.reduce((acc, digit, i) => {
      return acc + digit * (i % 2 === 0 ? 3 : 1);
    }, 0);
    
    const calculatedChecksum = (10 - (sum % 10)) % 10;
    
    return {
      isValid: checksum === calculatedChecksum,
      format: BarcodeFormat.UPCA,
      message: checksum !== calculatedChecksum ? 'UPC-A check digit is invalid' : undefined
    };
  },

  /**
   * Validates UPC-E barcodes
   * UPC-E: 8 digits (compressed UPC-A)
   */
  [BarcodeFormat.UPCE]: (barcode: string): BarcodeValidationResult => {
    if (!/^\d{8}$/.test(barcode)) {
      return {
        isValid: false,
        format: BarcodeFormat.UPCE,
        message: 'UPC-E barcode must be exactly 8 digits'
      };
    }
    
    // UPC-E is a compressed version of UPC-A, validation is complex
    // For simplicity, we just check if it has 8 digits
    return {
      isValid: true,
      format: BarcodeFormat.UPCE
    };
  },

  /**
   * Validates CODE-128 barcodes
   * CODE-128: Variable length, can contain all 128 ASCII characters
   */
  [BarcodeFormat.CODE128]: (barcode: string): BarcodeValidationResult => {
    // CODE-128 is very flexible, but should at least have some reasonable length
    if (barcode.length < 6) {
      return {
        isValid: false,
        format: BarcodeFormat.CODE128,
        message: 'CODE-128 barcode is too short'
      };
    }
    
    // For simplicity, we just check that it contains valid ASCII
    const isValidAscii = barcode.split('').every(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126);
    
    return {
      isValid: isValidAscii,
      format: BarcodeFormat.CODE128,
      message: !isValidAscii ? 'CODE-128 contains invalid characters' : undefined
    };
  },

  /**
   * Validates CODE-39 barcodes
   * CODE-39: Variable length, limited character set
   */
  [BarcodeFormat.CODE39]: (barcode: string): BarcodeValidationResult => {
    // CODE-39 only allows: 0-9, A-Z, -, ., $, /, +, %, and space
    if (!/^[0-9A-Z\-\.\$\/\+\% ]+$/.test(barcode)) {
      return {
        isValid: false,
        format: BarcodeFormat.CODE39,
        message: 'CODE-39 contains invalid characters'
      };
    }
    
    return {
      isValid: true,
      format: BarcodeFormat.CODE39
    };
  },

  /**
   * Validates ITF (Interleaved 2 of 5) barcodes
   * ITF: Even number of digits, typically 14 digits for shipping
   */
  [BarcodeFormat.ITF]: (barcode: string): BarcodeValidationResult => {
    if (!/^\d+$/.test(barcode) || barcode.length % 2 !== 0) {
      return {
        isValid: false,
        format: BarcodeFormat.ITF,
        message: 'ITF barcode must contain an even number of digits only'
      };
    }
    
    return {
      isValid: true,
      format: BarcodeFormat.ITF
    };
  }
};

/**
 * Detects the format of a barcode based on its pattern and length
 * @param barcode The barcode string to analyze
 * @returns The detected format
 */
export function detectBarcodeFormat(barcode: string): BarcodeFormat {
  // Early detection based on length and pattern
  if (/^\d{13}$/.test(barcode)) {
    return BarcodeFormat.EAN13;
  } else if (/^\d{12}$/.test(barcode)) {
    return BarcodeFormat.UPCA;
  } else if (/^\d{8}$/.test(barcode)) {
    return BarcodeFormat.UPCE;
  } else if (/^\d+$/.test(barcode) && barcode.length % 2 === 0) {
    return BarcodeFormat.ITF;
  } else if (/^[0-9A-Z\-\.\$\/\+\% ]+$/.test(barcode)) {
    return BarcodeFormat.CODE39;
  } else {
    // Default to CODE-128 which is the most flexible format
    return BarcodeFormat.CODE128;
  }
}

/**
 * Validates a barcode string according to its format
 * @param barcode The barcode string to validate
 * @param format Optional format to use for validation, if not provided it will be detected
 * @returns Validation result with format and status
 */
export function validateBarcode(barcode: string, format?: BarcodeFormat): BarcodeValidationResult {
  // Skip empty barcodes
  if (!barcode) {
    return {
      isValid: false,
      format: BarcodeFormat.UNKNOWN,
      message: 'Barcode is empty'
    };
  }

  // Detect format if not provided
  const detectedFormat = format || detectBarcodeFormat(barcode);
  
  // Use the appropriate validator
  if (validators[detectedFormat]) {
    return validators[detectedFormat](barcode);
  }
  
  // If no specific validator is available
  return {
    isValid: true, // Just assume it's valid
    format: detectedFormat
  };
}

/**
 * Clean and normalize a barcode input
 * @param input Raw input that might contain prefixes, suffixes or other scanner artifacts
 * @returns Cleaned barcode string
 */
export function cleanBarcodeInput(input: string): string {
  // Remove common prefixes/suffixes that some scanners might add
  let cleaned = input.trim();
  
  // Some scanners may add tab or special characters
  cleaned = cleaned.replace(/[\t\r\n]/g, '');
  
  // Some scanners might add specific prefixes like ]C1 for Code 128
  cleaned = cleaned.replace(/^\]\w\d/, '');
  
  return cleaned;
}

/**
 * Handle partial or corrupted barcode scans
 * @param partialBarcode The partial/corrupted barcode string
 * @returns Best guess of the complete barcode or null if too corrupted
 */
export function handlePartialBarcode(partialBarcode: string): string | null {
  // If the barcode is too short to be meaningful, it's likely corrupted
  if (partialBarcode.length < 5) {
    return null;
  }
  
  // EAN-13/UPC-A typical handling for partial scans
  if (/^\d+$/.test(partialBarcode)) {
    // If it's all digits and close to the right length
    if (partialBarcode.length >= 10 && partialBarcode.length <= 14) {
      // For EAN-13/UPC-A with missing leading or trailing digits
      if (partialBarcode.length === 12) {
        // Could be UPC-A with no check digit
        return partialBarcode;
      } else if (partialBarcode.length === 11 || partialBarcode.length === 10) {
        // Could be UPC-A with missing digits
        // Try to estimate what it might be (simplified approach)
        return partialBarcode.padStart(12, '0');
      }
    }
  }
  
  // For CODE39, CODE128 etc. which are variable length
  return partialBarcode;
}
