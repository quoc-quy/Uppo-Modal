const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// ============================== modal-1 ===========================
const modal1 = new Uppo({
    templateId: "modal-1",
    // enableScrollLock: false,
});

$("#modal-btn-1").onclick = () => {
    modal1.open();
};

// ============================== modal-2 ===========================

const modal2 = new Uppo({
    templateId: "modal-2",
    footer: true,
});

modal2.addFooterButton("Cancel", "modal-footer", (e) => {
    modal2.close();
});

modal2.addFooterButton("Submit", "modal-footer submit", (e) => {
    modal2.close();
});

$("#modal-btn-2").onclick = () => {
    modal2.open();
};

// ============================== modal-3 ===========================
const modal3 = new Uppo({
    templateId: "modal-3",
});

$("#modal-btn-3").onclick = () => {
    modal3.open();
};

// ============================== modal-2 ===========================

const modal4 = new Uppo({
    templateId: "modal-4",
    footer: true,
    closeMethods: [],
});

modal4.addFooterButton("Close", "modal-footer", (e) => {
    modal4.close();
});

$("#modal-btn-4").onclick = () => {
    modal4.open();
};

// ============================== modal-3 ===========================
const modal5 = new Uppo({
    templateId: "modal-5",
    destroyOnClose: false,
});

$("#modal-btn-5").onclick = () => {
    modal5.open();
};

// ============================== modal-6 ===========================
const modal6 = new Uppo({
    templateId: "modal-6",
});

$("#modal-btn-6").onclick = () => {
    modal6.open();
};

// ============================== modal-7 ===========================
const modal7 = new Uppo({
    templateId: "modal-7",
    destroyOnClose: false,
    content:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/HmFXik5Yz64?si=d2WfqkX4GH25_jTl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
});

$("#modal-btn-7").onclick = () => {
    modal7.open();
};
