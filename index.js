const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

{
    /* <div id="modal-1" class="modal-backdrop">
        <div class="modal-container">
            <button class="modal-close">&times;</button>
            <div class="modal-content">
                <p>Modal 1</p>
            </div>
        </div>
    </div> 
    */
}

function Modal() {
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

    this.openModal = (options = {}) => {
        const { templateId, allowBackdropClose = true } = options;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`#${templateId} does not exist!`);
            return;
        }

        const content = template.content.cloneNode(true);

        // Create modal Element
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and Element
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0);

        closeBtn.onclick = () => {
            this.closeModal(backdrop);
        };

        if (allowBackdropClose) {
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    this.closeModal(backdrop);
                }
            };
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeModal(backdrop);
            }
        });

        // Disable scroll
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        return backdrop;
    };

    this.closeModal = (elementModal) => {
        elementModal.classList.remove("show");
        elementModal.ontransitionend = () => {
            elementModal.remove();
        };

        // Enable scroll
        document.body.classList.remove("no-scroll");
        document.body.style.paddingRight = "";
    };
}

const modal = new Modal();

// modal.openModal("<h1>Hello</h1>");

$("#open-modal-1").onclick = () => {
    modal.openModal({
        templateId: "modal-1",
        allowBackdropClose: false,
    });
};

$("#open-modal-2").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-2",
    });

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
