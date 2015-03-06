/**
 * 
 * 应急人员列表
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.EmPersonList
 * @Description: 应急人员列表
 * @Author: TimTsang
 * @CreateDate: 2015年02月07日
 * @Version: [v1.0]
 * 
 */
var emPersonStore = null;
var userManageStoreAdd = null;
// 将getUserManageStore函数提到外部
$(function() {
			wwGetUserManageStoreAdd = getUserManageStoreAdd;
		});
function getUserManageStoreAdd(userManageStore) {
	userManageStoreAdd = userManageStore;
}
Ext.define('KX.zjx.EmPersonList', {
	id : 'EmPersonListPanel',
	extend : 'Ext.grid.GridPanel',
	personStore : null,// 资源存储器
	closable : true,
	initComponent : function() {
		var me = this;
		this.personStore = new Ext.data.JsonStore({
					id : 'emPersonStore',
					storeId : "personStore",
					fields : ["id", 'staffName', 'sex', 'department', 'phone'],
					proxy : {
						type : 'ajax',
						url : '../../character/user!getEmergencyStaff.action',
						actionMethods: {
				            read: 'POST'  
				        },
						reader : {
							root : 'list',
							totalProperty : "totalCount"
						}
					},
					autoLoad : true,
					pageSize : 20
				});
		// 将用户管理资源对象装进emPersonStore
		emPersonStore = this.personStore;
		Ext.applyIf(me, {
					tbar : [{
								text : "查询应急人员",
								handler : this.searchEmPerson,
								scope : this,
								icon : 'KX/zjx/icons/search.gif',
								tooltip : '按应急人员名称进行查询'
							}],
					store : this.personStore,
					columns : [{ // 列
						header : "应急人员名称",
						flex : 0.5,
						align : 'center',
						sortable : true,
						dataIndex : "staffName"
					}, {
						header : "性别",
						flex : 0.5,
						align : 'center',
						sortable : true,
						dataIndex : "sex"
					}, {
						header : "部门",
						flex : 0.5,
						align : 'center',
						sortable : true,
						dataIndex : "department"
					}, {
						header : "电话",
						flex : 0.5,
						align : 'center',
						sortable : true,
						dataIndex : "phone"
					}, {
						header : "用户增加",
						xtype : 'actioncolumn',
						flex : 0.5,
						align : 'center',
						items : [{
									icon : 'KX/zjx/icons/user_add.png',
									tooltip : '将该应急人员添加到系统用户中',
									handler : function(grid, rowIndex, colIndex) {
										var store = grid.getStore();
										var rec = store.getAt(rowIndex);// 获取当前选中项
										var emergencyStaffId = rec.raw.id;
										//检查用户是否已存在
										Ext.Ajax.request({
											method : "POST",
											url : '../../character/user!getEmergencyStaffBeforeSave.action',
											params : {
												'emergencyStaffId' : emergencyStaffId
											},

											success : function(response, options) {
												jsonObj = Ext.decode(response.responseText);
												if (jsonObj.result == true) {
													me.checkUserWin(rec);
												} else {
													Ext.Msg.show({
																title : '错误提示',
																msg : jsonObj.msg,
																buttons : Ext.Msg.OK,
																icon : Ext.Msg.ERROR
															});
												}

											},
											failure : function(response, options) {
												Ext.Msg.show({
															title : '错误提示',
															msg : '数据加载失败！',
															buttons : Ext.Msg.OK,
															icon : Ext.Msg.ERROR
														});
											}
										});
									}
								}]
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
						store : this.personStore,
						displayInfo : true,
						displayMsg : '第 {0} - {1} 条  共 {2}条',
						emptyMsg : "没有记录"
					})
				});
		me.callParent(arguments);
	},

	// 查询应急人员
	searchEmPerson : function() {
		Ext.create('KX.zjx.searchEmPerson', {
					title : "查询应急人员",
					icon : 'KX/zjx/icons/search.gif',
					modal : true
				}).show();
		// 将获取到的资源对象emPersonStore传到searchEmPerson的窗口里
		wGetSearchEmPersonStore(emPersonStore);
	},

	// 增加用户
	checkUserWin : function(rec) {
		var nowRecord = rec;// 当前选中项
		var editWin = Ext.create('KX.zjx.userAdd', {
					title : '用户增加',
					icon : 'KX/zjx/icons/user_add.png',
					modal : true
				});
		editWin.show();
		// 将获取到的资源对象userManageStore传到userAdd的窗口里
		wGetUserManageStoreAdd(userManageStoreAdd);
		var record = this.createNewRecord(nowRecord); // 重构一个新的record
		editWin.myForm.getForm().loadRecord(record); // 加载数据
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
								name : 'user.realName'
							}, {
								name : 'user.department'
							}]
				});
		var user = Ext.create('User', {
					'user.id' : nowRecord.raw.id,
					'user.realName' : nowRecord.raw.staffName,
					'user.department' : nowRecord.raw.department
				});
		return user;
	}

});