/**
 * 
 * 用户管理
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.userManage
 * @Description: 用户管理
 * @Author: TimTsang
 * @CreateDate: 2015年01月16日
 * @Version: [v1.0]
 * 
 */
var userManageStore = null;
Ext.define('KX.zjx.userManage', {
			id : 'userManagePanel',
			extend : 'Ext.grid.GridPanel',
			userStore : null,// 资源存储器
			title : '用户管理',
			closable : true,
			initComponent : function() {
				var me = this;
				this.userStore = new Ext.data.JsonStore({
							id : 'userManageStore',
							storeId : "userStore",
							fields : ["id", 'username', 'realName',
									'createTime', 'active', 'roles',
									'department'],
							proxy : {
								type : 'ajax',
								url : '../../character/user!getAllUser.action',
								reader : {
									root : 'list',
									totalProperty : "totalCount"
								}
							},
							autoLoad : true,
							pageSize : 20
						});
				// 将用户管理资源对象装进userManageStore
				userManageStore = this.userStore;
				Ext.applyIf(me, {
							tbar : [{
										text : "用户增加",
										handler : this.addUserWin,
										scope : this,
										icon : 'KX/zjx/icons/user_add.png',
										tooltip : '从应急人员中选择'
									}, "-", {
										text : '用户编辑',
										handler : this.checkUserWin,
										scope : this,
										icon : 'KX/zjx/icons/user_edit.png',
										tooltip : '编辑前先选择一名系统用户'
									}, "-", {
										text : "用户删除",
										handler : this.deleteUserConfirm,
										scope : this,
										icon : 'KX/zjx/icons/user_delete.png',
										tooltip : '删除前先选择一名系统用户'
									}],
							store : this.userStore,
							columns : [{ // 列
								header : "用户名称",
								flex : 0.5,
								align : 'center',
								sortable : true,
								dataIndex : "username"
							}, {
								header : "真实姓名",
								flex : 0.5,
								align : 'center',
								sortable : true,
								dataIndex : "realName"
							}, {
								header : "创建时间",
								flex : 0.5,
								align : 'center',
								sortable : true,
								dataIndex : "createTime"
							}, {
								header : "激活状态",
								flex : 0.5,
								align : 'center',
								sortable : true,
								dataIndex : "active"
							}, {
								header : "所属角色",
								flex : 0.5,
								align : 'center',
								sortable : true,
								dataIndex : "roles"
							}, {
								header : "所属部门",
								flex : 0.5,
								align : 'center',
								sortable : true,
								dataIndex : "department"
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
								store : this.userStore,
								displayInfo : true,
								displayMsg : '第 {0} - {1} 条  共 {2}条',
								emptyMsg : "没有记录"
							})
						});
				me.callParent(arguments);
			},

			// 增加用户
			addUserWin : function() {
				// 调用资源管理中的应急人员管理界面
				KX.globalFunction.addTab('EmPersonList', '用户增加','KX.zjx.EmPersonList', 'user_add.png', true);
				// 将获取到的资源对象userManageStore传到userAdd的窗口里
				wwGetUserManageStoreAdd(userManageStore);
			},

			// 编辑用户
			checkUserWin : function() {
				var _sm = this.getSelectionModel(); // 获取当前表格行选择模式
				if (_sm.getCount() > 0) { // 如果选择了一行记录
					var nowRecord = _sm.getSelection()[0]; // 获取表格当前选择行的record
					var editWin = Ext.create('KX.zjx.userEdit', {
								title : '用户编辑',
								icon : 'KX/zjx/icons/user_edit.png',
								modal : true
							});
					editWin.show();
					// 将获取到的资源对象userManageStore传到userEdit的窗口里
					wGetUserManageStore(userManageStore);
					var record = this.createNewRecord(nowRecord); // 重构一个新的record
					editWin.myForm.getForm().loadRecord(record); // 加载数据
				} else {
					Ext.Msg.show({
						title : "温馨提示",
						msg : "请您选择一条您要编辑的用户信息！",
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
				Ext.define('User', {
							extend : 'Ext.data.Model',
							fields : [{
										name : 'user.id'
									}, {
										name : 'user.username'
									}, {
										name : 'user.password'
									}, {
										name : 'user.realName'
									}, {
										name : 'user.createTime'
									}, {
										name : 'user.active'
									}, {
										name : 'user.roles'
									}, {
										name : 'user.department'
									}]
						});
				var user = Ext.create('User', {
							'user.id' : nowRecord.get('id'),
							'user.username' : nowRecord.get('username'),
							'user.password' : nowRecord.get('password'),
							'user.realName' : nowRecord.get('realName'),
							'user.createTime' : nowRecord.get('createTime'),
							'user.active' : nowRecord.get('active'),
							'user.roles' : nowRecord.get('roles'),
							'user.department' : nowRecord.get('department')
						});
				return user;
			},

			// 删除用户
			deleteUserConfirm : function() {
				var _sm = this.getSelectionModel(); // 获取当前选择模板
				if (_sm.getCount() > 0) {
					Ext.Msg.confirm("温馨提示", "删除该用户将删除所有相关信息，<br>您确定要删除吗?",
							this.onDeleteConfrimBtnClick, this);
				} else {
					Ext.Msg.show({
								title : "温馨提示",
								msg : "请您选择一条您要删除的用户信息！",
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
								url : "../../character/user!delete.action",
								method : "post",
								success : function() {
									this.getStore().reload(); // 刷新资源列表
								},
								failure : function() {
									Ext.Msg.alert("温馨提示", "删除错误……");
								},
								scope : this,
								params : {
									'id' : _pkid
								}
							});
				}
			}

		});