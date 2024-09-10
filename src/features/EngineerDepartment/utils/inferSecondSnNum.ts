// Infer second sn_num from first sn_num
// 模仁的sn_num has special format (e.g., "11-030-02-R01")
export default function inferSecondSnNum(snNum: string): string | null {
  if (snNum.length !== 9 || !/^\d{2}-\d{3}-\d{2}$/.test(snNum)) {
    // Ensure sn_num format is valid (e.g., "11-030-01")
    return null;
  }

  const sixthChar = snNum[5];
  if (sixthChar === "0") {
    // Change 0 to 1
    return snNum.slice(0, 5) + "1" + snNum.slice(6);
  } else if (sixthChar === "1") {
    // Change 1 to 0
    return snNum.slice(0, 5) + "0" + snNum.slice(6);
  }

  // Return null if the sixth character isn't 0 or 1
  return null;
}
