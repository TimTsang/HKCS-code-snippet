/**
 * 
 * 我的任务store
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.taskListStore
 * @Description: 查看我的事件全部信息
 * @Author: TimTsang
 * @CreateDate: 2014年12月07日
 * @Version: [v1.0]
 * 
 */

Ext.define('KX.zjx.taskListStore', {
			extend : 'Ext.data.Store',
			fields : ['id', 'text', 'departmentType', 'departmentName',
					'createTime', 'acceptTime', 'state'],
			proxy : {
				type : 'ajax',
				method : 'post',
				url : '../../command/task!getMyListByType.action',
				reader : {
					root : 'list',
					totalProperty : "totalCount"
				}
			},
			autoLoad : false,
			pageSize : 20
			,
		});