"use strict";


document.addEventListener("DOMContentLoaded", () => {


    // detect touch devices

    const isMobile = {
        isTouchDevice: function () {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        },
        userAgent: function () {
            return /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
        },
        any: function () {
            return isMobile.isTouchDevice() || isMobile.userAgent();
        }
    };

    function getNavigator() {
        const body = document.body;

        if (isMobile.any() || window.innerWidth < 992) {
            body.classList.remove('_pc');
            body.classList.add('_touch');
        } else {
            body.classList.remove('_touch');
            body.classList.add('_pc');
        }
    }

    getNavigator();

    window.addEventListener('resize', getNavigator);




    var phoneInputs = document.querySelectorAll('input[type="tel"]');

    var getInputNumbersValue = function (input) {
        // Return stripped input value — just numbers
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Editing in the middle of input, not last symbol
            if (e.data && /\D/g.test(e.data)) {
                // Attempt to input non-numeric symbol
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }
    var onPhoneKeyDown = function (e) {
        // Clear input after remove last symbol
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }

    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }




    // click handlers

    document.addEventListener('click', (e) => {

        const target = e.target;


        if (target.closest('.icon-menu') || target.classList.contains('menu__close')) {
            getMenu()
        }

        if (target.classList.contains('menu__arrow')) {

            let subMenu = target.nextElementSibling;

            if (document.querySelector('.menu__arrow.active') !== target) {

                if (document.querySelector('.submenu.open')) {
                    document.querySelector('.submenu.open').classList.remove('open');
                }
                if (document.querySelector('.menu__arrow.active')) {
                    document.querySelector('.menu__arrow.active').classList.remove('active');
                }
            }

            subMenu.classList.toggle('open');
            target.classList.toggle('active');

        }

        if (target.classList.contains('product-card__tabs-btn')) {
            handleTabs(target, {
                btnClass: 'product-card__tabs-btn',
                containerClass: 'product-card__body',
                contentWrapperClass: 'product-card__content',
                contentItemClass: 'product-card__tab-content'
            });
        }

        if (target.classList.contains('overview__tabs-btn')) {
            handleTabs(target, {
                btnClass: 'overview__tabs-btn',
                containerClass: 'overview__tabs',
                contentWrapperClass: 'overview__tabs-content',
                contentItemClass: 'overview__tabs-block'
            });
        }

        if (target.classList.contains('tariffs__btn')) {

            handleTabs(target, {
                btnClass: 'tariffs__btn',
                containerClass: 'tariffs__body',
                contentWrapperClass: 'tariffs__content',
                contentItemClass: 'tariffs__content-tab'
            });
        }


    });

    function handleTabs(target, { btnClass, containerClass, contentWrapperClass, contentItemClass }) {
        if (!target.classList.contains(btnClass)) return;

        const tabsContainer = target.closest(`.${containerClass}`);
        const allTabs = tabsContainer.querySelectorAll(`.${btnClass}`);
        const contentContainer = tabsContainer.querySelector(`.${contentWrapperClass}`);
        const allContents = contentContainer.querySelectorAll(`.${contentItemClass}`);

        const index = Array.from(allTabs).indexOf(target);

        allTabs.forEach(tab => tab.classList.remove('active'));
        allContents.forEach(content => content.classList.remove('active'));

        target.classList.add('active');
        if (allContents[index]) {
            allContents[index].classList.add('active');
        }
    }


    function getMenu() {
        document.querySelector('.header').classList.toggle('open-menu');
        toggleLocking();
    }

    function toggleLocking(lockClass) {

        const body = document.body;
        let className = lockClass ? lockClass : "lock";
        let pagePosition;

        if (body.classList.contains(className)) {
            pagePosition = parseInt(document.body.dataset.position, 10);
            body.dataset.position = pagePosition;
            body.style.top = -pagePosition + 'px';
        } else {
            pagePosition = window.scrollY;
            body.style.top = 'auto';
            window.scroll({ top: pagePosition, left: 0 });
            document.body.removeAttribute('data-position');
        }

        let lockPaddingValue = body.classList.contains(className)
            ? "0px"
            : window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";

        body.style.paddingRight = lockPaddingValue;
        body.classList.toggle(className);

    }

    // sliders

    if (document.querySelector('.promo__slider')) {
        new Swiper('.promo__slider', {
            slidesPerView: "auto",
            spaceBetween: 16,
            breakpoints: {
                991.98: {
                    slidesPerView: 3
                }
            }
        })
    }

    if (document.querySelector('.cases__slider-block')) {
        new Swiper('.cases__slider-block', {
            spaceBetween: 15,
            slidesPerView: 1,

            watchSlidesProgress: true,
            navigation: {
                nextEl: ".cases__next",
                prevEl: ".cases__prev"
            },
            breakpoints: {
                991.98: {
                    slidesPerView: 2,
                    spaceBetween: 18,
                },
            }
        })
    }

    if (document.querySelector('.support__slider')) {
        new Swiper('.support__slider', {
            slidesPerView: "auto",
            spaceBetween: 30,
            breakpoints: {
                1279.98: {
                    slidesPerView: 4,
                },
            }
        })
    }

    if (document.querySelector('.reviews__slider')) {
        new Swiper('.reviews__slider', {
            spaceBetween: 30,
            navigation: {
                nextEl: ".reviews__next",
                prevEl: ".reviews__prev"
            },
            pagination: {
                el: ".reviews__pagination",
                clickable: true,
            },
            breakpoints: {
                575.98: {
                    slidesPerView: 2,
                },
                991.98: {
                    slidesPerView: 3,
                },
                1439.98: {
                    slidesPerView: 4,
                },
            }
        })
    }

    if (document.querySelector('.news__slider')) {
        new Swiper('.news__slider', {

            spaceBetween: 30,
            navigation: {
                nextEl: ".news__next",
                prevEl: ".news__prev"
            },
            pagination: {
                el: ".news__pagination",
                clickable: true,
            },
            breakpoints: {
                575.98: {
                    slidesPerView: 2,
                },
                991.98: {
                    slidesPerView: 3,
                },
                1439.98: {
                    slidesPerView: 4,
                },
            }
        })
    }

    if (document.querySelector('.services__slider')) {
        getMobileSlider('.services__slider', {
            autoHeight: true,
            pagination: {
                el: ".services__pagination",
                clickable: true,
            },
        })
    }

    if (document.querySelectorAll('.products__slider').length > 0) {
        document.querySelectorAll('.products__slider').forEach(function (slider) {
            getMobileSlider(slider, {
                slidesPerView: "auto",
                spaceBetween: 10,
                pagination: {
                    el: slider.querySelector(".products__pagination"),
                    clickable: true,
                },
            })
        })

    }

    if (document.querySelectorAll('.products__carousel').length > 0) {
        document.querySelectorAll('.products__carousel').forEach(function (slider) {
            new Swiper(slider, {
                slidesPerView: 1,
                spaceBetween: 30,
                watchOverflow: true,
                pagination: {
                    el: slider.querySelector(".products__pagination"),
                    clickable: true,
                },
                breakpoints: {
                    767.98: {
                        slidesPerView: 2,
                    },
                    1279.98: {
                        slidesPerView: 3,
                    },
                    1699.98: {
                        slidesPerView: 4,
                    }
                }
            })
        })
    }

    if (document.querySelectorAll('.catalog__products-slider').length > 0) {
        document.querySelectorAll('.catalog__products-slider').forEach(function (slider) {
            const wrapper = slider.closest('.catalog__products-block');
            const prevBtn = wrapper.querySelector('.catalog__products-prev');
            const nextBtn = wrapper.querySelector('.catalog__products-next');
            const pagination = wrapper.querySelector('.catalog__products-pagination');

            new Swiper(slider, {
                slidesPerView: 1,
                spaceBetween: 30,
                watchOverflow: true,
                pagination: {
                    el: pagination,
                    clickable: true,
                },
                navigation: {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                },
                breakpoints: {
                    575.98: {
                        slidesPerView: 1.5,
                    },
                    767.98: {
                        slidesPerView: 2,
                    },
                    1699.98: {
                        slidesPerView: 3,
                    }
                },
            })
        })

    }


    if (document.querySelector('.focus__slider')) {
        getMobileSlider('.focus__slider', {
            autoHeight: true,
            pagination: {
                el: ".focus__pagination",
                clickable: true,
            },
        })
    }

    if (document.querySelectorAll('.tariffs__slider').length > 0) {
        document.querySelectorAll('.tariffs__slider').forEach(function (slider) {

            const pagination = slider.querySelector('.tariffs__slider-pagination');

            new Swiper(slider, {
                slidesPerView: "auto",
                spaceBetween: 30,
                watchOverflow: true,
                autoHeight: true,
                pagination: {
                    el: pagination,
                    clickable: true,
                },
                breakpoints: {
                    991.98: {
                        slidesPerView: 2,
                        autoHeight: false,
                    },
                    1699.98: {
                        slidesPerView: 3,
                        autoHeight: false,
                    }
                },
            })
        })

    }

    if (document.querySelector('.extras__slider')) {

        new Swiper('.extras__slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            watchOverflow: true,

            pagination: {
                el: '.extras__slider-pagination',
                clickable: true,
            },
            breakpoints: {
                991.98: {
                    slidesPerView: 2,

                },

            },
        })

    }


    function getMobileSlider(sliderName, options) {

        let init = false;
        let swiper = null;

        function getSwiper() {
            if (window.innerWidth <= 767.98) {
                if (!init) {
                    init = true;
                    swiper = new Swiper(sliderName, options);
                }
            } else if (init) {
                swiper.destroy();
                swiper = null;
                init = false;
            }
        }
        getSwiper();
        window.addEventListener("resize", getSwiper);
    }

    // calalog highlight active category
    const sections = document.querySelectorAll('.catalog__products-block');
    const navLinks = document.querySelectorAll('.catalog__category');

    if (sections.length !== 0 || navLinks.length !== 0) {

        const options = {
            root: null,
            rootMargin: '0px 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id.replace(/^#/, '');

                    navLinks.forEach(link => {
                        const hrefId = link.getAttribute('href')?.replace(/^#/, '');
                        link.classList.toggle('active', hrefId === sectionId);
                    });
                }
            });
        }, options);

        sections.forEach(section => {
            if (section.id) observer.observe(section);
        });
    }



    // init spollers

    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {

        const spollersRegular = Array.from(spollersArray).filter(function (
            item,
            index,
            self
        ) {
            return !item.dataset.spollers.split(",")[0];
        });

        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }

        const spollersMedia = Array.from(spollersArray).filter(function (
            item,
            index,
            self
        ) {
            return item.dataset.spollers.split(",")[0];
        });

        if (spollersMedia.length > 0) {
            const breakpointsArray = [];
            spollersMedia.forEach((item) => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });


            let mediaQueries = breakpointsArray.map(function (item) {
                return (
                    "(" +
                    item.type +
                    "-width: " +
                    item.value +
                    "px)," +
                    item.value +
                    "," +
                    item.type
                );
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });


            mediaQueries.forEach((breakpoint) => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                const spollersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });

                matchMedia.addEventListener("change", function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }


        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach((spollersBlock) => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("_init");
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove("_init");
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }

        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
            if (spollerTitles.length > 0) {
                spollerTitles.forEach((spollerTitle) => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerTitle.classList.contains("_active")) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
                const spollerTitle = el.hasAttribute("data-spoller")
                    ? el
                    : el.closest("[data-spoller]");
                const spollersBlock = spollerTitle.closest("[data-spollers]");
                const oneSpoller = spollersBlock.hasAttribute("data-one-spoller")
                    ? true
                    : false;
                if (!spollersBlock.querySelectorAll("._slide").length) {
                    if (oneSpoller && !spollerTitle.classList.contains("_active")) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle("_active");
                    spollerTitle.nextElementSibling.slideToggle(300);
                }
                e.preventDefault();
            }
        }

        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector(
                "[data-spoller]._active"
            );
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove("_active");
                spollerActiveTitle.nextElementSibling.slideUp(300);
            }
        }
    }


    // custom select

    class CustomSelect {

        static openDropdown = null;

        constructor(selectElement) {
            this.$select = selectElement;
            this.placeholder = this.$select.dataset.placeholder;
            this.listCaption = this.$select.dataset.listCaption;
            this.defaultText = this.getDefaultText();
            this.selectName = this.$select.getAttribute('name');
            this.$options = this.$select.querySelectorAll('option');
            this.$dropdown = null;
            this.initialState = {};
            this.init();
        }

        init() {
            if (!this.$select) return;
            this.saveInitialState();
            this.$select.classList.add('hidden');
            this.renderDropdown();
            this.setupEvents();
        }

        saveInitialState() {
            const selectedOption = this.$select.options[this.$select.selectedIndex];
            this.initialState = {
                selectedText: selectedOption.text,
                selectedValue: selectedOption.value,
            };
        }

        getDefaultText() {
            const selectedOption = this.$select.querySelector('option[selected]');
            if (selectedOption) {
                return selectedOption.text;
            } else {
                return this.placeholder || this.$select.options[this.$select.selectedIndex].text;
            }
        }

        renderDropdown() {
            const isDisabled = this.$select.disabled;

            const buttonTemplate = `
            <button type="button" class="dropdown__button icon-chevron" 
                    aria-expanded="false" 
                    aria-haspopup="true" 
                    ${isDisabled ? 'disabled' : ''}>
                <span class="dropdown__button-text">${this.defaultText}</span>
            </button>
        `;


            this.$dropdown = document.createElement('div');
            this.$dropdown.classList.add('dropdown');


            const captionTemplate = this.listCaption ? `<div class="dropdown__caption">${this.listCaption}</div>` : '';

            this.$dropdown.innerHTML = `
            ${buttonTemplate}
            <div class="dropdown__body" aria-hidden="true">
               <div class="dropdown__content">
                    ${captionTemplate}
                    <ul class="dropdown__list" role="listbox"></ul>
                </div>
            </div>
        `;

            const list = this.$dropdown.querySelector('.dropdown__list');
            this.$options.forEach(option => {
                const value = option.value;
                const text = option.text;
                const isSelected = option.selected;
                const isDisabled = option.disabled;

                const listItem = document.createElement('li');
                listItem.setAttribute('role', 'option');
                listItem.setAttribute('data-value', value);
                listItem.setAttribute('aria-checked', isSelected);
                listItem.classList.add('dropdown__list-item');
                if (isSelected) listItem.classList.add('selected');
                if (isDisabled) listItem.classList.add('disabled');
                if (isDisabled) listItem.setAttribute('aria-disabled', 'true');
                listItem.textContent = text;
                list.appendChild(listItem);
            });

            this.$select.after(this.$dropdown);
        }

        setupEvents() {
            const button = this.$dropdown.querySelector('.dropdown__button');
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const isOpen = this.$dropdown.classList.contains('visible');
                this.toggleDropdown(!isOpen);
            });

            const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
            listItems.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (!item.classList.contains('disabled')) {
                        this.selectOption(item);
                    }
                });
            });

            document.addEventListener('click', () => this.closeDropdown());
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') this.closeDropdown();
            });

            this.$select.closest('form').addEventListener('reset', () => this.restoreInitialState());

            const observerDisabled = new MutationObserver(() => {
                const isSelectDisabled = this.$select.disabled;
                const button = this.$dropdown.querySelector('.dropdown__button');

                button.disabled = isSelectDisabled;
            });

            observerDisabled.observe(this.$select, {
                attributes: true,
                attributeFilter: ['disabled']
            });

            const observerSelected = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                        const option = mutation.target;
                        const value = option.value;
                        const isDisabled = option.disabled;
                        const listItem = this.$dropdown.querySelector(`.dropdown__list-item[data-value="${value}"]`);

                        listItem.classList.toggle('disabled', isDisabled);
                        if (isDisabled) {
                            listItem.setAttribute('aria-disabled', 'true');
                        } else {
                            listItem.removeAttribute('aria-disabled');
                        }
                    }

                    if (mutation.type === 'attributes' && mutation.attributeName === 'selected') {
                        this.syncSelectedOption();
                    }
                });
            });

            observerSelected.observe(this.$select, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['selected', 'disabled']
            });
        }

        toggleDropdown(isOpen) {
            if (isOpen && CustomSelect.openDropdown && CustomSelect.openDropdown !== this) {
                CustomSelect.openDropdown.closeDropdown();
            }

            const body = this.$dropdown.querySelector('.dropdown__body');
            const list = this.$dropdown.querySelector('.dropdown__list');
            const hasScroll = list.scrollHeight > list.clientHeight;

            this.$dropdown.classList.toggle('visible', isOpen);
            this.$dropdown.querySelector('.dropdown__button').setAttribute('aria-expanded', isOpen);
            body.setAttribute('aria-hidden', !isOpen);

            if (isOpen) {
                CustomSelect.openDropdown = this;
                this.$dropdown.classList.remove('dropdown-top');
                const dropdownRect = body.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                if (dropdownRect.bottom > viewportHeight) {
                    this.$dropdown.classList.add('dropdown-top');
                }

                list.classList.toggle('has-scroll', hasScroll);
            } else {
                if (CustomSelect.openDropdown === this) {
                    CustomSelect.openDropdown = null;
                }
            }
        }

        closeDropdown() {
            this.toggleDropdown(false);
        }

        selectOption(item) {
            const value = item.dataset.value;
            const text = item.textContent;

            const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
            listItems.forEach(listItem => {
                listItem.classList.remove('selected');
                listItem.setAttribute('aria-checked', 'false');
            });
            item.classList.add('selected');
            item.setAttribute('aria-checked', 'true');



            this.$dropdown.querySelector('.dropdown__button').classList.add('selected');
            this.$dropdown.querySelector('.dropdown__button-text').textContent = text;
            this.$select.value = value;
            this.$select.dispatchEvent(new Event('change'));
            this.closeDropdown();
        }

        restoreInitialState() {
            const hasPlaceholder = this.placeholder !== undefined;

            if (hasPlaceholder) {
                this.$select.selectedIndex = -1;
                this.$dropdown.querySelector('.dropdown__button-text').textContent = this.placeholder;
                this.$dropdown.querySelector('.dropdown__button').classList.remove('selected');

                const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
                listItems.forEach(listItem => {
                    listItem.classList.remove('selected');
                    listItem.setAttribute('aria-checked', 'false');
                });

                this.$select.dispatchEvent(new Event('change'));
            } else {
                const state = this.initialState;
                this.$select.value = state.selectedValue;
                this.$select.dispatchEvent(new Event('change'));

                const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
                listItems.forEach(listItem => {
                    listItem.classList.remove('selected');
                    listItem.setAttribute('aria-checked', 'false');
                });

                const selectedItem = this.$dropdown.querySelector(`.dropdown__list-item[data-value="${state.selectedValue}"]`);

                if (selectedItem) {
                    selectedItem.classList.add('selected');
                    selectedItem.setAttribute('aria-checked', 'true');
                }

                this.$dropdown.querySelector('.dropdown__button-text').textContent = state.selectedText;
                this.$dropdown.querySelector('.dropdown__button').classList.add('selected');
            }
        }

        syncSelectedOption() {
            const selectedOption = this.$select.options[this.$select.selectedIndex];
            const selectedValue = selectedOption.value;
            const selectedText = selectedOption.text;

            const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
            listItems.forEach(listItem => {
                listItem.classList.remove('selected');
                listItem.setAttribute('aria-checked', 'false');
            });

            const selectedItem = this.$dropdown.querySelector(`.dropdown__list-item[data-value="${selectedValue}"]`);
            selectedItem.classList.add('selected');
            selectedItem.setAttribute('aria-checked', 'true');

            this.$dropdown.querySelector('.dropdown__button-text').textContent = selectedText;
        }
    }

    document.querySelectorAll('.select')?.forEach(element => {
        new CustomSelect(element);
    });






});



// Инициализация библиотеки Fancybox
// Документация: https://fancyapps.com/fancybox/

if (typeof Fancybox !== "undefined" && Fancybox !== null) {
    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeButton: false
    });
}


/**
 * Выполняет анимацию плавного появления или скрытия HTML-элемента (аналог slideToggle).
 *
 * Методы:
 * 
 * 1. element.slideToggle(duration, callback)
 *    Переключает видимость элемента:
 *    - Если элемент скрыт (высота = 0), он будет плавно показан (slide down).
 *    - Если элемент видим, он будет скрыт (slide up).
 *
 * 2. element.slideUp(duration, callback)
 *    Плавно скрывает элемент, уменьшая его высоту до 0.
 *
 * 3. element.slideDown(duration, callback)
 *    Плавно показывает элемент, увеличивая его высоту до естественной.
 *
 * @param {number} duration - Длительность анимации в миллисекундах.
 * @param {function} [callback] - Необязательная функция, вызываемая по завершении анимации.
 */

HTMLElement.prototype.slideToggle = function (duration, callback) {
    if (this.clientHeight === 0) {
        _s(this, duration, callback, true);
    } else {
        _s(this, duration, callback);
    }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
    _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {

    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";

    var elStyles = window.getComputedStyle(el);

    var elHeight = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    var stepHeight = elHeight / duration;
    var stepPaddingTop = elPaddingTop / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop = elMarginTop / duration;
    var stepMarginBottom = elMarginBottom / duration;

    var start;

    function step(timestamp) {

        if (start === undefined) start = timestamp;

        var elapsed = timestamp - start;

        if (isDown) {
            el.style.height = (stepHeight * elapsed) + "px";
            el.style.paddingTop = (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = (stepMarginBottom * elapsed) + "px";
        } else {
            el.style.height = elHeight - (stepHeight * elapsed) + "px";
            el.style.paddingTop = elPaddingTop - (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = elMarginTop - (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = elMarginBottom - (stepMarginBottom * elapsed) + "px";
        }

        if (elapsed >= duration) {
            el.style.height = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.overflow = "";
            if (!isDown) el.style.display = "none";
            if (typeof callback === 'function') callback();
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}