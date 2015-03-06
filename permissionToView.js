/**
 * 
 * 查看权限
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.permissionToView
 * @Description: 查看权限
 * @Author: TimTsang
 * @CreateDate: 2015年01月28日
 * @Version: [v1.0]
 * 
 */
Ext.define('KX.zjx.permissionToView', {
	id : 'permissionToView',
	extend : 'Ext.window.Window',
	resizable : false,
	myTreepanel : null,
	roleId : null,
	checkedArray : null,
	initComponent : function() {
		var me = this;
		me.myTreepanel = new Ext.tree.Panel({
					border : false, // 不要边框
					rootVisible : false,
					useArrows : true,
					store : new Ext.data.TreeStore({
								proxy: {
				                    type: 'ajax',
				                    url: '../../character/role!getPermissions.action',
				                    extraParams : {
										id : me.roleId
									}
				                }
							}),
					listeners : {
						"checkchange" : function(node, checked, eOpts) {
							me.listenerNotCheck(node, checked);
						}
					}
				});
		Ext.applyIf(me, {
					title : '权限分配',
					autoScroll : true,
					width : 500,
					height : 600,
					items : [me.myTreepanel],
					buttons : [{
								text : '确定',
								handler : me.submitForm,
								scope : this
							}, {
								text : '取消',
								handler : me.onClose,
								scope : this
							}]
				});
		me.callParent(arguments);
	},

	// 添加监听 设置树的节点选择的级联关系
	listenerNotCheck : function(node, checked) {
		var tnode;
		if (checked) {// 选择的时候
			// 父节点
			tnode = node;
			while (tnode) {
				tnode.set('checked', checked);
				tnode = tnode.parentNode;
			}
			// 子节点
			tnode = node;
			// 如果是节点
			if (tnode.get('leaf') == true)
				return;
			// 如果还没展开，存在一个bug，load问题，导致子节点没打勾。
			if (tnode.get('expanded') == false) {
				tnode.expand(true);
			}
			// 选择所有子节点
			this.childHasChecked(tnode, checked);
		} else {
			// 取消的时候
			// 子节点
			tnode = node;
			this.childHasChecked(tnode, checked);
			tnode.collapse(false);
			// 父节点
			tnode = node;
			if (tnode.parentNode.get('id') == '0') {
				tnode.collapse();
				return;
			}
			var hasChildChecked = false;
			tnode = tnode.parentNode;
			while (tnode.get('id') != '0') {
				for (var i = 0; i < tnode.childNodes.length; i++)
					if (tnode.childNodes[i].get('checked') == true) {
						hasChildChecked = true;
						break;
					}
				if (!hasChildChecked) {
					tnode.set('checked', false);
					tnode.collapse();
					tnode = tnode.parentNode;
				} else {
					break;
				}
			}
		}
	},

	// 级联选择子节点
	childHasChecked : function(node, checked) {
		node.cascadeBy(function(child) {
					child.set("checked", checked);
				});
	},
	submitForm : function() {
		var checkedString = this.getAllChecked();
		if (this.roleId) {
			Ext.Ajax.request({
						url : '../../character/role!updatePermission.action',
						method : "POST",
						params : {
							permissionIds : checkedString,
							id : this.roleId
						},
						success : function(form, action) {
							Ext.Msg.confirm('温馨提示', '您确定要修改该角色的权限？', function(
											btn) {
										if (btn == 'yes') {
											Ext.MessageBox.alert('温馨提示', '数据已经成功提交！');
											Ext.getCmp('permissionToView').close();
										}
									});
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', '表单提交失败！');
						},
						scope : this
					});
		} else {
			wGetCheckedString(checkedString);
			this.doClose();
			this.myTreepanel.getStore().reload(); // 刷新资源列表
		}

	},

	// 获取所有已经选择了的节点,返回所有已选结点的Id并用逗号隔开
	getAllChecked : function(CheckedNodes) {
		this.checkedArray = new Array;
		var rootNode = this.myTreepanel.getStore().tree.root;
		this.findAllChecked(rootNode);
		return (this.checkedArray.join(","));
	},

	// 遍历树获取所有已经选择了的结点的Id
	findAllChecked : function(nodes) {
		for (var i = 0; i < nodes.childNodes.length; i++) {
			if (nodes.childNodes[i].get('checked')) {
				this.checkedArray.push(nodes.childNodes[i].get('id'));
			}
			if (!nodes.childNodes[i].get('leaf')) {
				this.findAllChecked(nodes.childNodes[i]);
			}
		}
	},

	onClose : function() {
		this.doClose();
	}
});