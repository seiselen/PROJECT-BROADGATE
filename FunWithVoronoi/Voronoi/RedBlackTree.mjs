/*----------------------------------------------------------------------
|>>> Class VRBTree : [V]oronoi [R]ed-[B]lack [Tree]
+-----------------------------------------------------------------------
| Description: Implements a Red-Black Tree data structure via "C version 
|              of 'rbtree' by Franck Bui-Huu". Refactored into MJS class
|              with minimized comments and syntax by Steven Eiselen.
| Orig Source: https://github.com/fbuihuu/libtree/blob/master/rb.c
| Authors:     > Raymond Hill <rhill@raymondhill.net> (original version)
|              > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+---------------------------------------------------------------------*/

/** 
 * Accurate JSDoc description of node composition.
 * @typedef {Object} VRBTreeNode
 * @property {VRBTreeNode} rbLeft
 * @property {VRBTreeNode} rbRight
 * @property {VRBTreeNode} rbNext
 * @property {VRBTreeNode} rbPrev
 * @property {VRBTreeNode} rbRed
 * @property {VRBTreeNode} rbParent 
 */


/** **VRBTree** (**V**oronoi **R**ed-**B**lack **Tree**) */
class VRBTree {
  constructor(){this.root=null;}
  getFirst(node){while (node.rbLeft){node=node.rbLeft;} return node;}
  getLast(node){while (node.rbRight){node=node.rbRight;} return node;} 
  rbRotateLeft(node){let p=node; let q=node.rbRight; let par=p.rbParent; if (par){if (par.rbLeft===p){par.rbLeft=q;} else {par.rbRight=q;}} else {this.root=q;} q.rbParent=par; p.rbParent=q; p.rbRight=q.rbLeft; if (p.rbRight){p.rbRight.rbParent=p;} q.rbLeft=p;}
  rbRotateRight(node){let p=node; let q=node.rbLeft; let par=p.rbParent; if (par){if (par.rbLeft===p){par.rbLeft=q;} else {par.rbRight=q;}} else {this.root=q;} q.rbParent=par; p.rbParent=q; p.rbLeft=q.rbRight; if (p.rbLeft){p.rbLeft.rbParent=p;} q.rbRight=p;}
  rbInsertSuccessor(node, successor){let parent; if (node){successor.rbPrevious=node;successor.rbNext=node.rbNext; if (node.rbNext){node.rbNext.rbPrevious=successor;} node.rbNext=successor; if (node.rbRight){node=node.rbRight; while (node.rbLeft){node=node.rbLeft;} node.rbLeft=successor;} else {node.rbRight=successor; } parent=node;} else if (this.root){node=this.getFirst(this.root); successor.rbPrevious=null; successor.rbNext=node; node.rbPrevious=successor; node.rbLeft=successor; parent=node;} else {successor.rbPrevious=successor.rbNext=null; this.root=successor; parent=null;} successor.rbLeft=successor.rbRight=null; successor.rbParent=parent; successor.rbRed=true; let grandpa,uncle; node=successor; while (parent && parent.rbRed){grandpa=parent.rbParent; if (parent===grandpa.rbLeft){uncle=grandpa.rbRight; if (uncle && uncle.rbRed){parent.rbRed=uncle.rbRed=false; grandpa.rbRed=true; node=grandpa;}else {if (node===parent.rbRight){this.rbRotateLeft(parent); node=parent; parent=node.rbParent;} parent.rbRed=false; grandpa.rbRed=true; this.rbRotateRight(grandpa);}} else {uncle=grandpa.rbLeft; if (uncle&&uncle.rbRed){parent.rbRed=uncle.rbRed=false; grandpa.rbRed=true; node=grandpa;}else {if (node===parent.rbLeft){this.rbRotateRight(parent); node=parent; parent=node.rbParent;} parent.rbRed=false; grandpa.rbRed=true; this.rbRotateLeft(grandpa);}} parent=node.rbParent;} this.root.rbRed=false;}
  rbRemoveNode(node){if (node.rbNext){node.rbNext.rbPrevious=node.rbPrevious;} if (node.rbPrevious){node.rbPrevious.rbNext=node.rbNext;} node.rbNext=node.rbPrevious=null; let parent=node.rbParent,left=node.rbLeft,right=node.rbRight,next; if (!left){next=right;} else if (!right){next=left;} else {next=this.getFirst(right);} if (parent){if (parent.rbLeft===node){parent.rbLeft=next;} else {parent.rbRight=next;}} else {this.root=next;}let isRed; if (left && right){isRed=next.rbRed; next.rbRed=node.rbRed; next.rbLeft=left; left.rbParent=next; if (next !== right){parent=next.rbParent; next.rbParent=node.rbParent; node=next.rbRight; parent.rbLeft=node; next.rbRight=right; right.rbParent=next;} else {next.rbParent=parent; parent=next; node=next.rbRight;}} else {isRed=node.rbRed; node=next;} if (node){node.rbParent=parent;} if (isRed){return;} if (node && node.rbRed){node.rbRed=false; return;} let sibling; do {if (node===this.root){break;} if (node===parent.rbLeft){sibling=parent.rbRight; if (sibling.rbRed){sibling.rbRed=false; parent.rbRed=true; this.rbRotateLeft(parent); sibling=parent.rbRight;} if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)){if (!sibling.rbRight || !sibling.rbRight.rbRed){sibling.rbLeft.rbRed=false; sibling.rbRed=true; this.rbRotateRight(sibling); sibling=parent.rbRight;} sibling.rbRed=parent.rbRed; parent.rbRed=sibling.rbRight.rbRed=false; this.rbRotateLeft(parent); node=this.root; break;}} else {sibling=parent.rbLeft; if (sibling.rbRed){sibling.rbRed=false; parent.rbRed=true; this.rbRotateRight(parent); sibling=parent.rbLeft;} if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)){if (!sibling.rbLeft || !sibling.rbLeft.rbRed){sibling.rbRight.rbRed=false;sibling.rbRed=true; this.rbRotateLeft(sibling); sibling=parent.rbLeft;} sibling.rbRed=parent.rbRed; parent.rbRed=sibling.rbLeft.rbRed=false; this.rbRotateRight(parent); node=this.root; break;}} sibling.rbRed=true; node=parent; parent=parent.rbParent;} while (!node.rbRed); if (node){node.rbRed=false;}}
}

export default VRBTree;