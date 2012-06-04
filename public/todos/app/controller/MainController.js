/*
 * File: app/controller/MainController.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('TodosApp.controller.MainController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mainPanel: '#mainPanel',
            listPanel: '#listPanel',
            editPanel: '#editPanel'
        },

        control: {
            "#taskTextField": {
                keyup: 'onTaskTextFieldKeyup'
            },
            "#taskList": {
                itemdoubletap: 'onTaskListItemDoubletap',
                itemtap: 'onTaskListItemTap',
                initialize: 'onTaskListInitialize'
            },
            "#backButton": {
                tap: 'onBackButtonTap'
            },
            "#deleteButton": {
                tap: 'onDeleteButtonTap'
            },
            "#saveButton": {
                tap: 'onSaveButtonTap'
            },
            "#markAllCheckbox": {
                check: 'onMarkAllCheckboxCheck',
                uncheck: 'onMarkAllCheckboxUncheck'
            }
        }
    },

    onTaskTextFieldKeyup: function(textfield, e, options) {
        var value = textfield.getValue();
        // handle the enter key
        if (e.event.keyCode === 13 && value !== "") {
            TodosApp.store.add({name: value, done: false});
            TodosApp.store.sync();
            textfield.reset();
        }
    },

    onTaskListItemDoubletap: function(dataview, index, target, record, e, options) {
        var mainPanel = this.getMainPanel(),
            editPanel = this.getEditPanel();

        editPanel.setRecord(record);
        //editPanel.down("#taskNameTextField").setValue(record.get("name"));
        //editPanel.down("#taskDoneCheckbox").setChecked(record.get("done"));
        mainPanel.down("#backButton").show();
        mainPanel.setActiveItem(1);  // 0 is the listPanel, 1 is the editPanel
    },

    onBackButtonTap: function(button, e, options) {
        button.hide();
        this.getMainPanel().setActiveItem(0);
    },

    onDeleteButtonTap: function(button, e, options) {
        var mainPanel = this.getMainPanel();

        TodosApp.store.remove(TodosApp.selectedTask);
        TodosApp.store.sync();
        mainPanel.down("#backButton").hide();
        mainPanel.setActiveItem(0);
    },

    onSaveButtonTap: function(button, e, options) {
        var editPanel = this.getEditPanel(),
            mainPanel = this.getMainPanel();

        var name = editPanel.down("#taskNameTextField").getValue(),
            done = editPanel.down("#taskDoneCheckbox").getChecked();

        TodosApp.selectedTask.set("name",name);
        TodosApp.selectedTask.set("done",done);
        TodosApp.store.sync();
        mainPanel.down("#backButton").hide();
        mainPanel.setActiveItem(0);
    },

    onTaskListItemTap: function(dataview, index, target, record, e, options) {
        TodosApp.selectedTask = record;
        if (TodosApp.selectedCheckbox) {
            setTimeout(function(){
                record.set("done",TodosApp.selectedCheckbox.checked);
                TodosApp.selectedCheckbox = undefined;
                TodosApp.store.sync();
            },500);
        }
    },

    onTaskListInitialize: function(component, options) {
        // here we setup taskList listen on the tap on the checkbox and record the selected checkbox 
        component.element.on({
            tap: function(e, el) {
                TodosApp.selectedCheckbox = el;    
            }, delegate: 'input[type=checkbox]'
        });
    },

    onMarkAllCheckboxCheck: function(checkboxfield, e, options) {
        this.updateTaskStatus(true);
    },

    onMarkAllCheckboxUncheck: function(checkboxfield, e, options) {
        this.updateTaskStatus(false);
    },

    init: function() {
        TodosApp.store = Ext.getStore("Tasks");

        TodosApp.store.on({
            scope: this,
            updaterecord: this.updateStoreInfo,
            load: this.updateStoreInfo
        });
    },

    updateStoreInfo: function() {
        var count,
            storeInfo = this.getListPanel().down("#storeInfo");

        TodosApp.store.filter("done",false);
        count = TodosApp.store.getCount();
        TodosApp.store.clearFilter();
        if (count > 0) {
            storeInfo.setHtml(count+" item"+(count>1?"s":"")+" left");
        } else {
            storeInfo.setHtml("");
        }
    },

    updateTaskStatus: function(done) {
        TodosApp.store.each(function(record){
            record.set("done",done);
        });
        TodosApp.store.sync();
    }

});