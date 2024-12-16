interface ParkingLotRow {
    code: string;
    totalSpaces: number;
}

interface ParkingLotColumn {
    code: string;
    occupiedBy: string | null;
    rowCode: string;
    removed?: boolean
}

interface ParkingLot {
    rows: ParkingLotRow[];
    columns: ParkingLotColumn[];
}

export default ParkingLot;
export { ParkingLotRow, ParkingLotColumn };