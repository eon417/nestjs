export class HeapSort {
  /**
   * Sorts an array of items using Heap Sort
   * @param items Array of items to sort
   * @returns Sorted array of items
   */
  public static sort(items: any[], sortKey: string = 'raw_price'): any[] {
    const n = items.length;

    // Build a max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(items, n, i);
    }

    // Extract elements from the heap
    for (let i = n - 1; i > 0; i--) {
      // Swap root (largest) with the last element
      [items[0], items[i]] = [items[i], items[0]];

      // Restore the heap property for the reduced heap
      this.heapify(items, i, 0, sortKey);
    }

    return items;
  }

  /**
   * Maintains the heap property for a subtree
   * @param items Array of items
   * @param size Size of the heap
   * @param root Index of the root of the subtree
   */
  private static heapify(
    items: any[],
    size: number,
    root: number,
    sortKey: string = 'raw_price',
  ): void {
    let largest = root; // Assume root is the largest
    const left = 2 * root + 1; // Left child index
    const right = 2 * root + 2; // Right child index

    // If the left child is larger than the root
    if (left < size && items[left][sortKey] > items[largest][sortKey]) {
      largest = left;
    }

    // If the right child is larger than the largest so far
    if (right < size && items[right][sortKey] > items[largest][sortKey]) {
      largest = right;
    }

    // If the largest is not the root, swap and heapify the affected subtree
    if (largest !== root) {
      [items[root], items[largest]] = [items[largest], items[root]];
      this.heapify(items, size, largest, sortKey);
    }
  }
}
