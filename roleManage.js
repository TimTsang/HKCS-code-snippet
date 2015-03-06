/**
 * 
 * 角色管理
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.roleManage
 * @Description: 角色管理
 * @Author: TimTsang
 * @CreateDate: 2015年01月16日
 * @Version: [v1.0]
 * 
 */
var roleManageStore = null;
Ext.define('KX.zjx.roleManage', {
	id : 'roleManagePanel',
	extend : 'Ext.grid.GridPanel',
	roleStore : null,// 资源存储器
	title : '角色管理',
	closable : true,
	initComponent : function() {
		var me = this;
		this.roleStore = new Ext.data.JsonStore({
					id : 'roleManageStore',
					storeId : "roleStore",
					fields : ['id', 'message', 'createTime', 'roleName'],
					proxy : {
						type : 'ajax',
						url : '../../character/role!getAllRole.action',
						reader : {
							root : 'list',
							totalProperty : "totalCount"
						}
					},
					autoLoad : true,
					pageSize : 20
				});
		// 将用户管理资源对象装进roleManageStore
		roleManageStore = this.roleStore;
		Ext.applyIf(me, {
			tbar : [{
						text : "角色增加",
						handler : this.addRoleWin,
						scope : this,
						icon : 'KX/zjx/icons/group_add.png',
						tooltip : '角色增加'
					}, "-", {
						text : '角色编辑',
						handler : this.checkRoleWin,
						scope : this,
						icon : 'KX/zjx/icons/group_edit.png',
						tooltip : '编辑前先选择一名角色'
					}, "-", {
						text : "角色删除",
						handler : this.deleteRoleConfirm,
						scope : this,
						icon : 'KX/zjx/icons/group_delete.png',
						tooltip : '删除前先选择一名角色'
					}],
			store : this.roleStore,
			columns : [{ // 列
				id : 'id',
				width : 30,
				align : 'center',
				hidden : true,
				dataIndex : "id"
			}, {
				header : "角色名称",
				flex : 0.5,
				align : 'center',
				sortable : true,
				dataIndex : "roleName"
			}, {
				header : "创建时间",
				flex : 0.5,
				align : 'center',
				sortable : true,
				dataIndex : "createTime"
			}, {
				header : "权限分配",
				xtype : 'actioncolumn',
				flex : 0.5,
				align : 'center',
				items : [{
					icon : 'KX/zjx/icons/award_star_gold_3.png',
					tooltip : '查看并分配该角色的权限',
					handler : function(iView, iCellEl, iColIdx, iRecord,
							iRowEl, iRowIdx, iEvent) {
						var roleId = iRowIdx.internalId;
						Ext.create('KX.zjx.permissionToView', {
									title : '查看并分配权限',
									icon : 'KX/zjx/icons/award_star_gold_3.png',
									roleId : roleId,
									modal : true
								}).show();
					}
				}]
			}, {
				header : "角色说明",
				flex : 0.5,
				align : 'center',
				sortable : true,
				dataIndex : "message"
			}],
			selModel : {
				// 单行选择模式
				singleSelect : true
			},
			// 填充加载时间
			loadMask : {
				msg : "正在加载数据,请稍候......"
			},
			bbar : new Ext.PagingToolbar({ // 底部分页工具栏
				pageSize : 20,
				store : this.roleStore,
				displayInfo : true,
				displayMsg : '第 {0} - {1} 条  共 {2}条',
				emptyMsg : "没有记录"
			})
		});
		me.callParent(arguments);

	},

	// 增加角色
	addRoleWin : function() {
		var addWin = Ext.create('KX.zjx.roleAdd', {
					title : '角色增加',
					icon : 'KX/zjx/icons/group_add.png',
					modal : true
				});
		addWin.show();
		// 将获取到的资源对象roleManageStore传到roleAdd的窗口里
		wGetRoleManageStoreAdd(roleManageStore);
	},

	// 编辑资源
	checkRoleWin : function() {
		var _sm = this.getSelectionModel(); // 获取当前表格行选择模式
		if (_sm.getCount() > 0) { // 如果选择了一行记录
			var nowRecord = _sm.getSelection()[0]; // 获取表格当前选择行的record
			var editWin = Ext.create('KX.zjx.roleEdit', {
						title : '角色编辑',
						icon : 'KX/zjx/icons/group_edit.png',
						modal : true
					});
			editWin.show();
			// 将获取到的资源对象roleManageStore传到roleEdit的窗口里
			wGetRoleManageStore(roleManageStore);
			var record = this.createNewRecord(nowRecord); // 重构一个新的record
			editWin.myForm.getForm().loadRecord(record); // 加载数据
		} else {
			Ext.Msg.show({
						title : "温馨提示",
						msg : "请您选择一条您要编辑的角色信息！",
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
					});
			return;
		}
	},

	/**
	 * 创建一个新数据集
	 * 
	 * @param {}
	 *            _nowRecord 表格的当前选择行的record
	 */
	createNewRecord : function(nowRecord) {
		Ext.define('Role', {
					extend : 'Ext.data.Model',
					fields : [{
								name : 'role.id'
							}, {
								name : 'role.roleName'
							}, {
								name : 'role.createTime'
							}, {
								name : 'role.message'
							}]
				});
		var role = Ext.create('Role', {
					'role.id' : nowRecord.get('id'),
					'role.roleName' : nowRecord.get('roleName'),
					'role.createTime' : nowRecord.get('createTime'),
					'role.message' : nowRecord.get('message')
				});
		return role;
	},

	// 删除资源
	deleteRoleConfirm : function() {
		var _sm = this.getSelectionModel(); // 获取当前选择模板
		if (_sm.getCount() > 0) {
			Ext.Msg.confirm("温馨提示", "您确定要删除当前行的角色信息吗?",
					this.onDeleteConfrimBtnClick, this);
		} else {
			Ext.Msg.show({
						title : "温馨提示",
						msg : "请您选择一条您要删除的角色信息！",
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
					});
		}
	},

	/**
	 * Ext.confirm(删除Confirm窗体按钮)单击事件
	 * 
	 * @param {}
	 *            _btn
	 */
	onDeleteConfrimBtnClick : function(_btn) {
		if (_btn == "yes") {
			// 获取当前表格的选择模式
			var _sm = this.getSelectionModel();
			// 获取当前表格主键id
			var _pkid = _sm.getSelection()[0].get("id");
			// 进行异步Ajax请求
			Ext.Ajax.request({
						url : "../../character/role!delete.action",
						method : "post",
						success : function() {
							this.getStore().reload(); // 刷新资源列表
						},
						failure : function() {
							Ext.Msg.alert("温馨提示", "删除错误……");
						},
						scope : this,
						params : {
							id : _pkid
						}
					});
		}
	}
	,

});