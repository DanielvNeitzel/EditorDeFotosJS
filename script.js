const newImg = document.getElementById("newImg");
const inputFile = document.querySelector("input[type=file]");
const img = document.querySelector(".img-content img");
const ButtonsFilter = document.querySelectorAll(".filters-content button");
const range = document.querySelector("input[type=range]");
const spnRangeValue = document.getElementById("spnRangeValue");
const btnResetFilters = document.getElementById("btnResetFilters");
const btnSalvar = document.getElementById("btnSalvar");
const emptyImg = document.querySelector(".emptyImg");
const currentImg = document.querySelector(".currentImg");
const rotateContent = document.querySelector(".rotate-content");
const filtersContent = document.querySelector(".filters-content");
const rangeLine = document.querySelector(".range-line");
const removeRangeVal = document.querySelector("#removeRangeVal");
const addRangeVal = document.querySelector("#addRangeVal");

let rotate;
let flipY;
let flipX;

let filterActive;

let filters;

btnResetFilters.onclick = () => resetImg(); init();

resetImg();

init();

function resetImg() {
    rangeLine.classList.add("hide");
    spnRangeValue.classList.add("hide");
    btnSalvar.classList.add("hide");
    btnResetFilters.classList.add("hide");
    currentImg.classList.add("hide");
    rotateContent.classList.add("hide");
    filtersContent.classList.add("hide");
    emptyImg.classList.remove("hide");
}

function init() {

    filters = {
        'light-ctrl': { value: 100, max: 200 },
        'contrast-ctrl': { value: 100, max: 200 },
        'saturation-ctrl': { value: 100, max: 200 },
        'color-ctrl': { value: 0, max: 100 },
        'color-inv-ctrl': { value: 0, max: 100 },
        'color-sepia-ctrl': { value: 0, max: 100 },
    };

    rotate = 0;
    flipY = 1;
    flipX = 1;

    filterActive = 'light-ctrl';

    spnRangeValue.innerHTML = 100 + '%';
    range.max = 200;
    range.value = 100;

    img.style.transform = "";
    img.style.filter = "";

    document.querySelector(".active").classList.remove("active");
    document.getElementById("light-ctrl").classList.add("active");
}

ButtonsFilter.forEach((item) => {
    item.onclick = () => {
        document.querySelector(".active").classList.remove("active");

        item.classList.add("active");

        filterActive = item.id;

        range.max = filters[filterActive].max;
        range.value = filters[filterActive].value;

        spnRangeValue.innerHTML = range.value + '%';
    };
});

newImg.onclick = () => inputFile.click();

inputFile.onchange = () => loadNewImage();

function loadNewImage() {
    let file = inputFile.files[0];

    if (file) {
        emptyImg.classList.add("hide");
        currentImg.classList.remove("hide");
        rangeLine.classList.remove("hide");
        spnRangeValue.classList.remove("hide");
        btnSalvar.classList.remove("hide");
        btnResetFilters.classList.remove("hide");
        currentImg.classList.remove("hide");
        rotateContent.classList.remove("hide");
        filtersContent.classList.remove("hide");

        img.src = URL.createObjectURL(file);
    }

    init();
}

range.oninput = () => {
    filters[filterActive].value = range.value;
    spnRangeValue.innerHTML = range.value + '%';

    img.style.filter = `
        brightness(${filters["light-ctrl"].value}%) 
        contrast(${filters["contrast-ctrl"].value}%) 
        saturate(${filters["saturation-ctrl"].value}%) 
        grayscale(${filters["color-ctrl"].value}%) 
        invert(${filters["color-inv-ctrl"].value}%)
        sepia(${filters["color-sepia-ctrl"].value}%)
    `;
};

function handleDirection(type) {
    if (type === "rotateRight") {
        rotate += 90;
    } else if (type === "rotateLeft") {
        rotate -= 90;
    } else if (type === "reflectY") {
        flipY = flipY === 1 ? -1 : 1;
    } else {
        flipX = flipX === 1 ? -1 : 1;
    }

    img.style.transform = `rotate(${rotate}deg) scale(${flipY}, ${flipX})`;
}

btnSalvar.onclick = () => download();

function download() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.filter = `
        brightness(${filters["light-ctrl"].value}%) 
        contrast(${filters["contrast-ctrl"].value}%) 
        saturate(${filters["saturation-ctrl"].value}%) 
        grayscale(${filters["color-ctrl"].value}%) 
        invert(${filters["color-inv-ctrl"].value}%)
        sepia(${filters["color-sepia-ctrl"].value}%)
    `;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);

    ctx.scale(flipY, flipX);
    ctx.drawImage(
        img,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
    );

    let data = new Date();
    const dataFormatada = ((data.getHours())) + "_" + ((data.getMinutes())) + "_" + ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
    const link = document.createElement("a");
    link.download = "Foto_Editada_" + dataFormatada + ".png";
    link.href = canvas.toDataURL();
    link.click();
}

removeRangeVal.onclick = () => ValRange('-');
addRangeVal.onclick = () => ValRange('+');

function ValRange(val) {
    if (val === '-') {
        range.value = range.value - 1;
    }
    if (val === '+') {
        range.value = range.value + 1;
    }
    range.oninput();
}
