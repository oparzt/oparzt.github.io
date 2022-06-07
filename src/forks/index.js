var forksCont = document.querySelector(".main__forks-cont");
var forksPS = new PerfectScrollbar(forksCont);
forksCont.scrollLeft = (forksPS.contentWidth - forksPS.containerWidth) / 2;

window.ps = forksPS;