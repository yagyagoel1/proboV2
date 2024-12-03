import { OrderBook, stockBalance, userBalanceType } from '@repo/types';
import * as fs from 'fs';
import * as path from 'path';


type DataSnapshot = {
  timestamp: number;
  data: any;
};

class Archiver {
  private snapshotDirectory: string;

  constructor(snapshotDirectory: string = './snapshots') {
    this.snapshotDirectory = snapshotDirectory;

    if (!fs.existsSync(this.snapshotDirectory)) {
      fs.mkdirSync(this.snapshotDirectory);
    }
  }

  saveSnapshot(snapshot: DataSnapshot, type: "orderbook" | "stockbalance" | "userbalance") {
    const timestamp = new Date(snapshot.timestamp);
    const filename = this.generateFilename(timestamp, type);

    const snapshotData = JSON.stringify(snapshot, null, 2);

    fs.writeFile(path.join(this.snapshotDirectory, filename), snapshotData, (err) => {
      if (err) {
        console.error('Error saving snapshot:', err);
      } else {
        console.log(`Snapshot saved to ${filename}`);
      }
    });
  }

  private generateFilename(timestamp: Date, type: "orderbook" | "stockbalance" | "userbalance"): string {
    const year = timestamp.getFullYear();
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const seconds = timestamp.getSeconds().toString().padStart(2, '0');

    return `${type}-snapshot-${year}${month}${day}-${hours}${minutes}${seconds}.json`;
  }
}

const archiver = new Archiver();


// setInterval(() => {
//   const snapshot: DataSnapshot = {
//     timestamp: Date.now(),
//     data: {orderbook:ord}
//   };

//   archiver.saveSnapshot(snapshot);
// }, 5000);
export function snapshooter(data:OrderBook|stockBalance|userBalanceType,type:"orderbook"|"stockbalance"|"userbalance"
){

const snapshot:DataSnapshot = {
    timestamp:Date.now(),
    data: data
}
archiver.saveSnapshot(snapshot,type)
}

