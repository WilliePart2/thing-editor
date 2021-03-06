import Window from "./window.js";
import game from "thing-engine/js/game.js";
import Group from "./group.js";
import DisplayObject from "thing-engine/js/components/display-object.js";

const errorIcon = R.icon('error-icon');
const warnIcon = R.icon('warn-icon');


const needAddInToList = (map, owner) => {
	if(!(owner instanceof DisplayObject)) {
		return true;
	} else {
		let exData = __getNodeExtendData(owner);
		if(!map.has(exData)) {
			map.set(exData, true);
			return true;
		}
	}
	return false;
};

export default class Status extends React.Component {
	
	constructor(props) {
		super(props);
		this.errorsMap = new WeakMap();
		this.warnsMap = new WeakMap();
		
		this.state = {};
		this.errors = [];
		this.warns = [];
		
		
		this.warnsListRef = this.warnsListRef.bind(this);
		this.errorsListRef = this.errorsListRef.bind(this);
		this.clear = this.clear.bind(this);
	}
	
	errorsListRef(ref) {
		this.errorsList = ref;
	}
	
	warnsListRef(ref) {
		this.warnsList = ref;
	}
	
	error (message, owner, fieldName) {
		console.error(message);
		let item = {owner, wonerId: owner.___id, message, fieldName};
		if(owner && fieldName) {
			item.val = owner[fieldName];
		}
		if(needAddInToList(this.errorsMap, owner)) {
			this.errors.push(item);
			if(this.errorsList) {
				this.errorsList.forceUpdate();
			} else {
				this.show();
			}
		}
	}
	
	warn (message, owner, fieldName) {
		console.warn(message);
		if(needAddInToList(this.warnsMap, owner)) {
			let item = {owner, message, fieldName};
			if(owner && fieldName) {
				item.val = owner[fieldName];
			}
			this.warns.push(item);
			if(this.errorsList) {
				this.warnsList.forceUpdate();
			} else {
				this.show();
			}
		}
	}

	clear () {
		this.errors.length = 0;
		this.warns.length = 0;
		
		this.errorsMap = new WeakMap();
		this.warnsMap = new WeakMap();
		
		this.hide();
	}
	
	show() {
		this.setState({toggled:true});
	}
	
	hide() {
		this.setState({toggled:false});
	}
	
	render() {
		if(this.state.toggled && ((this.errors.length > 0) || (this.warns.length > 0))) {
			setTimeout(() => {
				Window.bringWindowForward($('#window-info'));
			}, 1);
			return editor.ui.renderWindow('info', 'Info Window', R.fragment(
				R.btn('×', this.clear, 'Hide all', 'close-window-btn'),
				R.div({className:"status-body"},
					React.createElement(InfoList, {ref: this.errorsListRef, id:'errors-list', title:'Errors:', icon: errorIcon, className:'info-errors-list info-list', list:this.errors, itemsMap:this.errorsMap}),
					React.createElement(InfoList, {ref: this.warnsListRef, id:'warns-list', title:'Warnings:', icon: warnIcon, className:'info-warns-list info-list', list:this.warns, itemsMap: this.warnsMap})
				)
			), 586, 650, 400, 150, 1137, 407);
		}
		return R.span();
	}
}

const selectableSceneNodeProps = {className:"selectable-scene-node"};

class InfoList extends React.Component {
	
	constructor(props) {
		super(props);
		this.renderItem = this.renderItem.bind(this);
	}

	clearItem(item) {
		let i = this.props.list.indexOf(item);
		assert(i >= 0, "info list is corrupted");
		this.props.list.splice(i, 1);
		if(item.owner instanceof DisplayObject) {
			let exData = __getNodeExtendData(item.owner);
			this.props.itemsMap.delete(exData);
		}
		editor.ui.status.forceUpdate();
	}
	
	renderItem(item, i) {
		
		let node;
		if(item.owner && item.owner instanceof DisplayObject) {
			node = R.div(selectableSceneNodeProps, R.sceneNode(item.owner));

			let exData = __getNodeExtendData(item.owner);
			if(!exData.alertRefs) {
				exData.alertRefs = new WeakMap();
			}
			exData.alertRefs.set(item, true);
		}
		return R.div({key:i, className:'info-item clickable', onClick:() => {
			if(!item) {
				return;
			}
			if(typeof item.owner === "function") {
				item.owner();
			} else if(item.owner && (item.owner instanceof DisplayObject)) {
				
				let exData = __getNodeExtendData(item.owner);
				if(!exData.alertRefs || !exData.alertRefs.has(item)) {
					let newOwnerFinded;

					game.forAllChildrenEwerywhere((o) => {
						if(o.constructor === item.owner.constructor && o.___id === item.wonerId) {
							if(!newOwnerFinded) {
								item.owner = o;
								exData = __getNodeExtendData(item.owner);
								newOwnerFinded = true;
							}
						}
					});

					if(!newOwnerFinded) {
						editor.ui.modal.showModal('Object already removed form stage, or problem was solved.');
						return;
					}
				}

				if(item.owner.getRootContainer() !== game.currentContainer) {
					editor.ui.modal.showModal("Object can't be selected because it's container is not active for now.");
				} else {
					editor.ui.sceneTree.selectInTree(item.owner);
					if(item.fieldName) {
						setTimeout(() => {
							editor.ui.propsEditor.selecField(item.fieldName, true);
						}, 1);
					}
				}
				
			}
		}}, this.props.icon, item.message, node,
		R.btn('×', () => {
			this.clearItem(item);
			item = null;
		}, undefined, 'clear-item-btn danger-btn')
		);
	}

	render() {
		if(this.props.list.length <= 0) {
			return R.div();
		}
		return R.div(null,
			R.div({className:'info-badge'}, this.props.list.length),
			Group.renderGroup({key: this.props.id, content: this.props.list.map(this.renderItem), title: this.props.title})
		);
	}
}