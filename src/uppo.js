Uppo.elements = [];

function Uppo(options = {}) {
    if (!options.content && !options.templateId) {
        console.error("You must provide one of 'content' or 'templateId.'");
        return;
    }

    if (options.content && options.templateId) {
        options.templateId = null;
        console.warn(
            "Both 'content' and 'templateId' are specified. 'content' will take precedent, and 'templateId' will be ignored."
        );
    }

    if (options.templateId) {
        this.template = document.querySelector(`#${options.templateId}`);

        if (!this.template) {
            console.error(`#${options.templateId} does not exist!`);
            return;
        }
    }

    this.opt = Object.assign(
        {
            closeMethods: ["button", "overlay", "escape"],
            cssClass: [],
            destroyOnClose: true,
            footer: false,
            enableScrollLock: true,
            scrollLockTarget: () => document.body,
        },
        options
    );

    this.content = this.opt.content;
    const { closeMethods } = this.opt;
    this.allowBackdropClose = closeMethods.includes("overlay");
    this.allowButtonClose = closeMethods.includes("button");
    this.allowEscapesClose = closeMethods.includes("escape");

    this._footerButtons = [];

    this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Uppo.prototype._getScrollbarWidth = function () {
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

Uppo.prototype._build = function () {
    const contentNode = this.content
        ? document.createElement("div")
        : this.template.content.cloneNode(true);

    if (this.content) {
        contentNode.innerHTML = this.content;
    }

    // Create modal Element
    this._backdrop = document.createElement("div");
    this._backdrop.className = "uppo__backdrop";

    const container = document.createElement("div");
    container.className = "uppo__container";

    this.opt.cssClass.forEach((className) => {
        if (typeof className === "string") {
            container.classList.add(className);
        }
    });

    if (this.allowButtonClose) {
        const closeBtn = this._createButton("&times;", "uppo__close", () =>
            this.close()
        );

        container.append(closeBtn);
    }

    this._modalContent = document.createElement("div");
    this._modalContent.className = "uppo__content";

    // Append content and Element
    this._modalContent.append(contentNode);
    container.append(this._modalContent);

    if (this.opt.footer) {
        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "uppo__footer";

        this._renderFooterContent();

        this._renderFooterButton();

        container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
};

Uppo.prototype.open = function () {
    Uppo.elements.push(this);

    if (!this._backdrop) {
        this._build();
    }

    setTimeout(() => {
        this._backdrop.classList.add("uppo--show");
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
    if (Uppo.elements.length === 1 && this.opt.enableScrollLock) {
        const target = this.opt.scrollLockTarget();

        if (this._hasScrollbar(target)) {
            target.classList.add("uppo--no-scroll");

            const targetPadRight = parseFloat(
                getComputedStyle(target).paddingRight
            );
            target.style.paddingRight =
                targetPadRight + this._getScrollbarWidth() + "px";
        }
    }

    return this._backdrop;
};

Uppo.prototype._hasScrollbar = (target) => {
    if ([document.documentElement, document.body].includes(target)) {
        return (
            document.documentElement.scrollHeight >
                document.documentElement.clientHeight ||
            document.body.scrollHeight > document.body.clientHeight
        );
    }
    return target.scrollHeight > target.clientHeight;
};

Uppo.prototype._handleEscapeKey = function (e) {
    if (e.key === "Escape") {
        const lastModal = Uppo.elements[Uppo.elements.length - 1];

        if (lastModal === this) {
            this.close();
        }
    }
};

Uppo.prototype.setContent = function (content) {
    this.content = content;

    if (this._modalContent) {
        this._modalContent.innerHTML = this.content;
    }
};

Uppo.prototype.setFooterContent = function (html) {
    this._footerContent = html;
    this._renderFooterContent();
};

Uppo.prototype.addFooterButton = function (title, cssClass, callback) {
    const button = this._createButton(title, cssClass, callback);
    this._footerButtons.push(button);

    this._renderFooterButton();
};

Uppo.prototype._renderFooterContent = function () {
    if (this._modalFooter && this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
    }
};

Uppo.prototype._renderFooterButton = function () {
    if (this._modalFooter) {
        this._footerButtons.forEach((btn) => {
            this._modalFooter.append(btn);
        });
    }
};

Uppo.prototype._createButton = function (title, cssClass, callback) {
    const button = document.createElement("button");
    button.className = cssClass;
    button.innerHTML = title;
    button.onclick = callback;

    return button;
};

Uppo.prototype._onTransitionEnd = function (callback) {
    this._backdrop.ontransitionend = (e) => {
        if (e.propertyName !== "opacity") return;
        if (typeof callback === "function") callback();
    };
};

Uppo.prototype.close = function (destroy = this.opt.destroyOnClose) {
    Uppo.elements.pop();

    this._backdrop.classList.remove("uppo--show");

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
        if (this.opt.enableScrollLock && !Uppo.elements.length) {
            const target = this.opt.scrollLockTarget();

            if (this._hasScrollbar(target)) {
                target.classList.remove("uppo--no-scroll");
                target.style.paddingRight = "";
            }
        }

        if (typeof this.opt.onClose === "function") this.opt.onClose();
    });
};

Uppo.prototype.destroy = function () {
    this.close(true);
};
