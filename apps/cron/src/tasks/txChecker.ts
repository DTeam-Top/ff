export function txChecker(table: string, txCol: string, tsCol: string) {
  // select $txCol from $table where $tsCol < 0
  // for each tx: ether provider.getTransactionReceipt( hash ) to find
  // - if null returned, not yet mined
  // - if a tx returned and its status === 1, update $table.
}
