const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
    const {
        templateId,
        closeMethods = ["button", "overlay", "escape"],
        cssClass = [],
        destroyOnClose = true,
        footer = false,
        onOpen,
        onClose,
    } = options;
    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`#${templateId} does not exist!`);
        return;
    }
    this.allowBackdropClose = closeMethods.includes("overlay");
    this.allowButtonClose = closeMethods.includes("button");
    this.allowEscapesClose = closeMethods.includes("escape");

    function getScrollbarWidth() {
        if (getScrollbarWidth.value) {
            return getScrollbarWidth.value;
        }

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-999px",
        });

        document.body.appendChild(div);
        const scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        getScrollbarWidth.value = scrollbarWidth;

        return scrollbarWidth;
    }

    this._build = () => {
        const content = template.content.cloneNode(true);

        // Create modal Element
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        cssClass.forEach((className) => {
            if (typeof className === "string") {
                container.classList.add(className);
            }
        });

        if (this.allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);

            closeBtn.onclick = () => {
                this.close();
            };
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and Element
        modalContent.append(content);
        container.append(modalContent);

        if (footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";

            if (this._footerContent) {
                this._modalFooter.innerHTML = this._footerContent;
            }

            this._footerButton.forEach((btn) => {
                this._modalFooter.append(btn);
            });

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.open = () => {
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

        this._onTransitionEnd(() => {
            if (typeof onClose === "function") onOpen();
        });

        // Disable scroll
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        return this._backdrop;
    };

    this._handleEscapeKey = (e) => {
        if (e.key === "Escape") {
            const lastModal = Modal.elements[Modal.elements.length - 1];

            if (lastModal === this) {
                this.close();
            }
        }
    };

    this.setFooterContent = (html) => {
        this._footerContent = html;
        if (this._modalFooter) {
            this._modalFooter.innerHTML = html;
        }
    };

    this._footerButton = [];

    this.addFooterButton = (title, cssClass, callback) => {
        const button = document.createElement("button");
        button.className = cssClass;
        button.innerHTML = title;
        button.onclick = callback;

        this._footerButton.push(button);
    };

    this._onTransitionEnd = (callback) => {
        this._backdrop.ontransitionend = (e) => {
            if (e.propertyName !== "opacity") return;
            if (typeof callback === "function") callback();
        };
    };

    this.close = (destroy = destroyOnClose) => {
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
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";

            if (typeof onClose === "function") onClose();
        });
    };

    this.destroy = () => {
        this.close(true);
    };
}

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
