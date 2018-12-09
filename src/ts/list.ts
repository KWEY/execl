// import Utils from '../utils';

import { Link, Contextmenu } from '../../ui/src/ui';
import { SelectListInterface } from '../../ui/src/ts/select';
import { LocalInterface } from './info-set';
import { metadata } from '../../metadata';
import { LinkListInterface } from '../../ui/src/ts/link';
import Nav from './nav';
import Global from './global';
class List {
    nav: Nav;
    prefix: string;
    container: JQuery;
    local: LocalInterface;
    index: number;
    color: string[];
    listItem: JQuery;

    constructor(nav: Nav) {
        this.nav = nav;
        this.prefix = this.nav.prefix;
        this.container = this.nav.template.list;
        this.local = this.nav.infoSet.local;
        this.init();
        this.globalEvents();
    }

    init() {
        this.index = 0;
        this.color = ['#0ff', '#9cf', '#ccf', '#fcf', '#cff', '#3cf', '#faf'];
        this.load();
        this.listItem = $(`.${this.prefix}-list-item`);
        this.contextMenu();
    }
    private globalEvents() {
        this.nav.bind(Global.NAV_RELOAD, () => {
            this.reload();
        });
    }
    private contextMenu() {
        new Contextmenu(this.container[0], {
            menu: [],
            changedMode: true,
            changedType: 0,
            onChange: (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const id = $(target).data('id');
                const name = target.textContent;
                const menu = [
                    {
                        type: 'event',
                        text: '删除 ' + name,
                        click: () => {
                            id && this.removeSrc(id);
                        }
                    },
                    {
                        type: 'text',
                        text: '更新历史 ' + metadata.hash,
                        click: () => {
                            console.log('version', metadata.hash);
                        }
                    },
                ];
                return menu;
            }
        });
    }
    // reload
    reload() {
        this.load();
    }
    // 渲染src列表
    load() {
        this.container.html('');
        this.index = 0;
        const types = this.local.typeList.items;
        const len = this.color.length;
        types.forEach((item: SelectListInterface) => {
            const color = this.color[this.index % len];
            const list = this.local.srcList[item.id];
            if (list && list.length > 0) {
                this.container.append(new Link($(`<div class="${this.prefix}-list-item"></div>`)[0], {
                    type: item.name,
                    tid: item.id,
                    list,
                    bg: color,
                    border: color,
                }).container);
            }
            this.index += 1;
        });
    }
    // 删除src
    removeSrc(data: string) {
        const arr = data.split(',');
        const id = arr[0];
        const srclist = this.local.srcList[arr[1]];
        Array.isArray(srclist) && srclist.some((item: LinkListInterface, index: number) => {
            if (item.id === id) {
                srclist.splice(index, 1);
                this.load();
                this.nav.infoSet.setLocalSettings();
                return true;
            }
        });
    }
}

export default List;
