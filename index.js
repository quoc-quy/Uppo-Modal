const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
    this.opt = Object.assign(
        {
            closeMethods: ["button", "overlay", "escape"],
            cssClass: [],
            destroyOnClose: true,
            footer: false,
        },
        options
    );
    this.template = $(`#${this.opt.templateId}`);

    if (!this.template) {
        console.error(`#${this.opt.templateId} does not exist!`);
        return;
    }

    const { closeMethods } = this.opt;
    this.allowBackdropClose = closeMethods.includes("overlay");
    this.allowButtonClose = closeMethods.includes("button");
    this.allowEscapesClose = closeMethods.includes("escape");

    this._footerButtons = [];

    this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Modal.prototype._getScrollbarWidth = function () {
    if (this._scrollbarWidth) {
        return this._scrollbarWidth;
    }

    const div = document.createElement("div");
    Object.assign(div.style, {
        overflow: "scroll",
        position: "absolute",
        top: "-999px",
    });

    document.body.appendChild(div);
    this._scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return this._scrollbarWidth;
};

Modal.prototype._build = function () {
    const content = this.template.content.cloneNode(true);

    // Create modal Element
    this._backdrop = document.createElement("div");
    this._backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    this.opt.cssClass.forEach((className) => {
        if (typeof className === "string") {
            container.classList.add(className);
        }
    });

    if (this.allowButtonClose) {
        const closeBtn = this._createButton("&times;", "modal-close", () =>
            this.close()
        );

        container.append(closeBtn);
    }

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append content and Element
    modalContent.append(content);
    container.append(modalContent);

    if (this.opt.footer) {
        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "modal-footer";

        this._renderFooterContent();

        this._renderFooterButton();

        container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
};

Modal.prototype.open = function () {
    Modal.elements.push(this);

    if (!this._backdrop) {
        this._build();
    }

    setTimeout(() => {
        this._backdrop.classList.add("show");
    }, 0);

    if (this.allowBackdropClose) {
        this._backdrop.onclick = (e) => {
            if (e.target === this._backdrop) {
                this.close();
            }
        };
    }

    if (this.allowEscapesClose) {
        document.addEventListener("keydown", this._handleEscapeKey);
    }

    this._onTransitionEnd(this.opt.onOpen);

    // Disable scroll
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = this._getScrollbarWidth() + "px";

    return this._backdrop;
};

Modal.prototype._handleEscapeKey = function (e) {
    if (e.key === "Escape") {
        const lastModal = Modal.elements[Modal.elements.length - 1];

        if (lastModal === this) {
            this.close();
        }
    }
};

Modal.prototype.setFooterContent = function (html) {
    this._footerContent = html;
    this._renderFooterContent();
};

Modal.prototype.addFooterButton = function (title, cssClass, callback) {
    const button = this._createButton(title, cssClass, callback);
    this._footerButtons.push(button);

    this._renderFooterButton();
};

Modal.prototype._renderFooterContent = function () {
    if (this._modalFooter && this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
    }
};

Modal.prototype._renderFooterButton = function () {
    if (this._modalFooter) {
        this._footerButtons.forEach((btn) => {
            this._modalFooter.append(btn);
        });
    }
};

Modal.prototype._createButton = function (title, cssClass, callback) {
    const button = document.createElement("button");
    button.className = cssClass;
    button.innerHTML = title;
    button.onclick = callback;

    return button;
};

Modal.prototype._onTransitionEnd = function (callback) {
    this._backdrop.ontransitionend = (e) => {
        if (e.propertyName !== "opacity") return;
        if (typeof callback === "function") callback();
    };
};

Modal.prototype.close = function (destroy = this.opt.destroyOnClose) {
    Modal.elements.pop();

    this._backdrop.classList.remove("show");

    if (this.allowEscapesClose) {
        document.removeEventListener("keydown", this._handleEscapeKey);
    }

    this._onTransitionEnd(() => {
        if (this._backdrop && destroy) {
            this._backdrop.remove();
            this._backdrop = null;
            this._modalFooter = null;
        }

        // Enable scroll
        if (!Modal.elements.length) {
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        }

        if (typeof this.opt.onClose === "function") this.opt.onClose();
    });
};

Modal.prototype.destroy = function () {
    this.close(true);
};

const modal1 = new Modal({
    templateId: "modal-1",
    // destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 Opened!!");
    },
    onClose: () => {
        console.log("Modal 1 Closed!!");
    },
});

$("#open-modal-1").onclick = () => {
    modal1.open();
};
const modal2 = new Modal({
    templateId: "modal-2",
    footer: true,
    // cssClass: ["class1", "class2"],
    onOpen: () => {
        console.log("Modal 2 Opened!!");
    },
    onClose: () => {
        console.log("Modal 2 Closed!!");
    },
    // destroyOnClose: false,
});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();
    const form = modalElement.querySelector("#login-from");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const email = form.querySelector("#email").value.trim();
            const password = form.querySelector("#password").value.trim();
            console.log(email);
            console.log(password);
        };
    }
};

const modal3 = new Modal({
    templateId: "modal-3",
    footer: true,
    cssClass: ["class1", "class2"],
    onOpen: () => {
        console.log("Modal 3 Opened!!");
    },
    onClose: () => {
        console.log("Modal 3 Closed!!");
    },
    // destroyOnClose: false,
});

modal3.addFooterButton("Danger", "modal-btn danger", (e) => {
    modal3.close();
});

modal3.addFooterButton("Cancel", "modal-btn", (e) => {
    modal3.close();
});

modal3.addFooterButton("<span>Agree</span>", "modal-btn primary", (e) => {
    // Something...
    modal3.close();
});

$("#open-modal-3").onclick = () => {
    modal3.open();
};
