"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const REBALANCE_CONSTANT = 3;
class MinHeap {
    Push(obj, weight) {
        let node = { obj: obj, weight: weight, depth: -1, childCount: 0 };
        if (!this.headNode) {
            this.headNode = node;
            this.headNode.depth = 1;
            return;
        }
        this.Insert(this.headNode, node);
        this.RebalanceBranch(this.headNode);
    }
    Insert(headNode, newObj) {
        if (!headNode || !newObj) {
            return;
        }
        if (newObj.weight < headNode.weight) {
            let oldHead = this.createTempNode(headNode);
            this.CopyNodeValue(newObj, headNode);
            this.CopyNodeValue(oldHead, newObj);
        }
        if (headNode.left && headNode.right) {
            if (headNode.left.depth < headNode.right.depth) {
                this.Insert(headNode.left, newObj);
            }
            else {
                this.Insert(headNode.right, newObj);
            }
            headNode.depth = Math.max(headNode.left.depth, headNode.right.depth) + 1;
            headNode.childCount = headNode.left.childCount + headNode.right.childCount + 2;
        }
        else if (headNode.left) {
            newObj.parent = headNode;
            newObj.depth = 1;
            headNode.right = newObj;
            headNode.depth = headNode.left.depth + 1;
            headNode.childCount = headNode.left.childCount + 2;
        }
        else {
            newObj.parent = headNode;
            newObj.depth = 1;
            headNode.left = newObj;
            headNode.depth = 2;
            headNode.childCount = 1;
        }
    }
    Peek() {
        if (!this.headNode) {
            return undefined;
        }
        return this.headNode.obj;
    }
    PeekDeep(maxDepth) {
        return this.DeepPeek(maxDepth, this.headNode);
    }
    DeepPeek(maxDepth, headNode) {
        if (!headNode || headNode.depth > maxDepth)
            return [];
        return _.union([headNode.obj], this.DeepPeek(maxDepth, headNode.left), this.DeepPeek(maxDepth, headNode.right));
    }
    Pop() {
        if (!this.headNode) {
            return undefined;
        }
        let retVal = this.headNode.obj;
        this.BubbleUp(this.headNode);
        if (this.headNode) {
            this.RebalanceBranch(this.headNode);
        }
        return retVal;
    }
    BubbleUp(headNode) {
        if (!headNode) {
            return;
        }
        headNode.childCount--; // This should be good enough right?
        // headNode is considered dead atm, need to replace with next in line.
        if (headNode.left && headNode.right) {
            if (headNode.left.weight < headNode.right.weight) {
                this.CopyNodeValue(headNode.left, headNode);
                this.BubbleUp(headNode.left);
            }
            else {
                this.CopyNodeValue(headNode.right, headNode);
                this.BubbleUp(headNode.right);
            }
            // bubble up could replace the child node to undefined, check it again.
            let leftDepth = headNode.left ? headNode.left.depth : 0;
            let rightDepth = headNode.right ? headNode.right.depth : 0;
            headNode.depth = Math.max(leftDepth, rightDepth) + 1;
        }
        else if (headNode.left) {
            this.CopyNodeValue(headNode.left, headNode);
            this.BubbleUp(headNode.left); // just in case...not sure if this is necessary yet.
            headNode.depth = (headNode.left ? headNode.left.depth : 0) + 1;
        }
        else if (headNode.right) {
            this.CopyNodeValue(headNode.right, headNode);
            this.BubbleUp(headNode.right);
            headNode.depth = (headNode.right ? headNode.right.depth : 0) + 1;
        }
        else {
            if (headNode.parent === undefined) {
                this.headNode = undefined;
            }
            else {
                if (headNode.parent.left && headNode.parent.left === headNode) {
                    headNode.parent.left = undefined;
                    headNode.parent.depth = headNode.parent.right ? headNode.parent.right.depth + 1 : 1;
                }
                else if (headNode.parent.right && headNode.parent.right === headNode) {
                    headNode.parent.right = undefined;
                    headNode.parent.depth = headNode.parent.left ? headNode.parent.left.depth + 1 : 1;
                }
            }
        }
    }
    RebalanceBranch(headNode) {
        // Will only get called once per operation.  This means the tree may not be as balanced
        // as it could be, but I also won't spend much cpu balancing the tree.
        if (headNode.depth - Math.log2(headNode.childCount) > REBALANCE_CONSTANT) {
            let balanceLeft = false;
            if (headNode.left && headNode.right) {
                if (headNode.left.depth < headNode.right.depth) {
                    balanceLeft = true;
                }
            }
            else if (headNode.right) {
                balanceLeft = true;
            }
            if (balanceLeft) {
                let savedNode = headNode.right;
                this.BubbleUp(headNode.right);
                this.Insert(headNode, savedNode);
            }
            else {
                let savedNode = headNode.left;
                this.BubbleUp(headNode.left);
                this.Insert(headNode, savedNode);
            }
        }
    }
    CopyNodeValue(from, to) {
        to.weight = from.weight;
        to.depth = from.depth;
        to.obj = from.obj;
    }
    createTempNode(from) {
        let newNode = { weight: from.weight, obj: from.obj, childCount: 0, depth: -1 };
        return newNode;
    }
    static CompressHeap(heap, itemSerializer) {
        if (heap.headNode) {
            return this.compressNode(heap.headNode, itemSerializer);
        }
        return [];
    }
    static compressNode(headNode, itemSerializer) {
        let compressedArray = [];
        if (headNode.left) {
            compressedArray = this.compressNode(headNode.left, itemSerializer);
        }
        compressedArray.push([itemSerializer(headNode.obj), headNode.weight]);
        if (headNode.right) {
            let rightArray = this.compressNode(headNode.right, itemSerializer);
            compressedArray = _.union(compressedArray, rightArray);
        }
        return compressedArray;
    }
    static DeserializeHeap(compressedArray, itemDeserializer) {
        let newHeap = new MinHeap();
        while (compressedArray.length > 0) {
            let curItem = compressedArray.splice(0, 1)[0];
            newHeap.Push(itemDeserializer(curItem[0]), curItem[1]);
        }
        return newHeap;
    }
}
exports.MinHeap = MinHeap;
//# sourceMappingURL=MinHeap.js.map
