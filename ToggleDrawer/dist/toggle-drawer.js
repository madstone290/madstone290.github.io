var Services;
(function (Services) {
    Services.ToggleDrawer = () => {
        const CLS_ROOT = 'td-root';
        const CLS_ROOT_LIST = 'td-root-list';
        const CLS_TOGGLE_BTN_BOX = 'td-toggle-btn-box';
        const CLS_TOGGLE_BTN = 'td-toggle-btn';
        const CLS_HEADER_BOX = 'td-header-box';
        const CLS_DEFAULT_HEADER = 'td-default-header';
        const CLS_MENU_ITEM_BOX = 'td-menu-item-box';
        const CLS_MENU_ITEM_CONTENT = 'td-menu-item-content';
        const CLS_MENU_ITEM_SUB_LIST = 'td-menu-item-sub-list';
        const CLS_MENU_ITEM_ANCHOR = 'td-menu-item-anchor';
        const CLS_ARROW_ICON = 'td-arrow-icon';
        const CLS_LEVEL_PREFIX = 'td-level-';
        const CLS_SELECTED = 'td-selected';
        const CLS_MINI = 'td-mini';
        const CLS_HIDE_IN_MINI_MODE = 'td-hide-in-mini-mode';
        const CLS_HIDE_IN_NORMAL_MODE = 'td-hide-in-normal-mode';
        let _options;
        let _data;
        let _rootEl;
        let _headerBoxEl;
        let _rootListEl;
        let _isMini = false;
        function create(container) {
            _rootEl = document.createElement('div');
            _rootEl.classList.add(CLS_ROOT);
            container.appendChild(_rootEl);
        }
        function setOptions(options) {
            _options = options;
        }
        function setData(data) {
            _data = data;
        }
        function render() {
            if (_options.showToggleBtn) {
                _renderToggleBtn();
            }
            _renderHeader();
            _renderMenuItemList();
        }
        function select(id) {
            let itemBoxEl = _rootEl.querySelector(`[data-id="${id}"]`);
            _selectMenuItem(itemBoxEl);
        }
        function _findParentItemBoxEl(itemBoxEl) {
            if (itemBoxEl.parentElement.parentElement.classList.contains(CLS_MENU_ITEM_BOX)) {
                return itemBoxEl.parentElement.parentElement;
            }
            return null;
        }
        function toggle() {
            changeMode(!_isMini);
        }
        function changeMode(mini) {
            if (mini) {
                _rootEl.classList.add(CLS_MINI);
            }
            else {
                _rootEl.classList.remove(CLS_MINI);
            }
            _isMini = mini;
            if (_options.onModeChanged)
                _options.onModeChanged(_isMini);
        }
        function _renderRootList() {
            const rootListEl = document.createElement('div');
            rootListEl.classList.add(`${CLS_ROOT_LIST}`);
            return rootListEl;
        }
        function _adjustContainerElPosition(item, itemEl, childrenContainerEl) {
            if (!item.subList)
                return;
            const containerElHeight = childrenContainerEl.offsetHeight;
            const initialContainerElTop = itemEl.offsetTop - _rootEl.scrollTop;
            const containerMaxHeight = _rootEl.clientHeight;
            let adjustedContainerElTop = initialContainerElTop;
            if (initialContainerElTop + containerElHeight > containerMaxHeight) {
                adjustedContainerElTop = containerMaxHeight - containerElHeight;
                if (adjustedContainerElTop < 0) {
                    adjustedContainerElTop = 0;
                }
            }
            // 서브리스트가 화면 하단을 넘어가지 않도록 top을 조정한다.
            childrenContainerEl.style.top = adjustedContainerElTop + 'px';
            // 서브리스트가 아이템우측에 바로 위치하도록 clientWidth를 적용한다.
            childrenContainerEl.style.left = _rootEl.clientWidth + 'px';
        }
        /* render functions start */
        function _renderToggleBtn() {
            const toggleBtnBoxEl = document.createElement('div');
            toggleBtnBoxEl.classList.add(CLS_TOGGLE_BTN_BOX);
            const btnEl = _options.renderCustomToggleBtn
                ? _options.renderCustomToggleBtn(toggleBtnBoxEl)
                : _renderDefaultToggleBtn(toggleBtnBoxEl);
            btnEl.addEventListener('click', () => {
                changeMode(!_isMini);
            });
            _rootEl.appendChild(toggleBtnBoxEl);
        }
        function _renderHeader() {
            _headerBoxEl = document.createElement('div');
            _headerBoxEl.classList.add(CLS_HEADER_BOX);
            _rootEl.appendChild(_headerBoxEl);
            const _ = _options.renderCustomHeader
                ? _options.renderCustomHeader(_headerBoxEl)
                : _renderDefaultHeader(_headerBoxEl);
        }
        function _renderMenuItemList() {
            _rootListEl = _renderRootList();
            _data.menuItems.map(item => {
                const itemBox = _renderMenuItemBox(item, 0);
                _rootListEl.appendChild(itemBox);
            });
            _rootEl.appendChild(_rootListEl);
        }
        function _renderMenuItemBox(item, level) {
            const menuItemBoxEl = document.createElement('div');
            const clsLevel = CLS_LEVEL_PREFIX + level;
            menuItemBoxEl.classList.add(CLS_MENU_ITEM_BOX, clsLevel);
            menuItemBoxEl.setAttribute('data-id', item.id);
            _renderMenuItem(menuItemBoxEl, item, level);
            menuItemBoxEl.addEventListener('click', (event) => {
                event.stopPropagation();
                _selectMenuItem(menuItemBoxEl);
            });
            if (item.subList && item.subList.length > 0) {
                const subListEl = document.createElement('div');
                subListEl.className = `${CLS_MENU_ITEM_SUB_LIST}`;
                for (const child of item.subList) {
                    subListEl.appendChild(_renderMenuItemBox(child, level + 1));
                }
                menuItemBoxEl.appendChild(subListEl);
                menuItemBoxEl.addEventListener('mouseenter', (event) => {
                    if (_isMini) {
                        _adjustContainerElPosition(item, menuItemBoxEl, subListEl);
                    }
                });
            }
            _rootListEl.appendChild(menuItemBoxEl);
            return menuItemBoxEl;
        }
        function _selectMenuItem(menuItemBoxEl) {
            if (!menuItemBoxEl)
                return;
            // if the item is already selected, deselect it
            if (menuItemBoxEl.classList.contains(CLS_SELECTED)) {
                menuItemBoxEl.classList.remove(CLS_SELECTED);
                return;
            }
            if (_options.singleSelect) {
                // deselect every item except the current one and its parents
                const selectedItems = _rootEl.querySelectorAll(`.${CLS_SELECTED}`);
                for (const item of selectedItems) {
                    item.classList.remove(CLS_SELECTED);
                }
            }
            // select the current item and its parents
            let parentItemBoxEl = _findParentItemBoxEl(menuItemBoxEl);
            while (parentItemBoxEl) {
                parentItemBoxEl.classList.add(CLS_SELECTED);
                parentItemBoxEl = _findParentItemBoxEl(parentItemBoxEl);
            }
            menuItemBoxEl.classList.add(CLS_SELECTED);
        }
        function _renderMenuItem(box, item, level) {
            const contentContainerEl = document.createElement('div');
            contentContainerEl.classList.add(CLS_MENU_ITEM_CONTENT);
            if (_options.renderCustomMenuItemContent) {
                _options.renderCustomMenuItemContent(contentContainerEl, item, level);
            }
            else {
                const anchorEl = document.createElement('a');
                anchorEl.classList.add(CLS_MENU_ITEM_ANCHOR);
                if (item.url)
                    anchorEl.href = item.url;
                contentContainerEl.appendChild(anchorEl);
                const _ = _options.renderCustomAnchorContent
                    ? _options.renderCustomAnchorContent(anchorEl, item, level)
                    : _renderDefaultAnchorContent(anchorEl, item, level);
            }
            if (item.subList && item.subList.length > 0) {
                const arrowEl = document.createElement('i');
                arrowEl.classList.add('fa', 'fa-angle-left', CLS_ARROW_ICON);
                contentContainerEl.appendChild(arrowEl);
            }
            box.appendChild(contentContainerEl);
            return contentContainerEl;
        }
        /* render functions end */
        /* default render functions  start */
        function _renderDefaultToggleBtn(box) {
            const toggleBtnEl = document.createElement('div');
            toggleBtnEl.classList.add(CLS_TOGGLE_BTN);
            toggleBtnEl.classList.add('fa', 'fa-bars');
            box.appendChild(toggleBtnEl);
            return toggleBtnEl;
        }
        function _renderDefaultHeader(box) {
            const header = document.createElement('div');
            header.classList.add(CLS_DEFAULT_HEADER);
            const basicContent = document.createElement('div');
            basicContent.classList.add(CLS_HIDE_IN_MINI_MODE);
            header.appendChild(basicContent);
            const nameEl = document.createElement('div');
            nameEl.innerText = 'James (P012)';
            basicContent.appendChild(nameEl);
            const departmentEl = document.createElement('div');
            departmentEl.innerText = 'System Development Team';
            basicContent.appendChild(departmentEl);
            const miniContent = document.createElement('div');
            miniContent.classList.add(CLS_HIDE_IN_NORMAL_MODE);
            miniContent.innerText = 'TD';
            header.appendChild(miniContent);
            box.appendChild(header);
            return header;
        }
        function _renderDefaultAnchorContent(anchor, item, level) {
            const iconEl = document.createElement('i');
            if (item.icon) {
                iconEl.className = item.icon;
                iconEl.style.marginRight = '5px';
            }
            const nameEl = document.createElement('span');
            nameEl.classList.add(CLS_HIDE_IN_MINI_MODE);
            nameEl.innerText = item.name;
            anchor.appendChild(iconEl);
            anchor.appendChild(nameEl);
        }
        /* default renderers  end */
        return {
            create,
            setOptions,
            setData,
            render,
            changeMode,
            toggle,
            select
        };
    };
})(Services || (Services = {}));
