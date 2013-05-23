/*jslint browser: true*/
/*global YUI*/
YUI().use("node", function (Y) {
    'use strict';
    var node, mainTable, create_block_cells, option_dblclick, option_rightclick,
        select_option, create_main_tr, remove_other_options, cell_dblclick,
        create_cell_options, recreate_cells, i, tr;

    window.document.body.oncontextmenu = function () {
        return false;
    };

    node = Y.one('#sudoku');
    mainTable = Y.Node.create('<table></table>');
    create_main_tr = function (row) {
        var tr = Y.Node.create('<tr></tr>'), i, td;
        for (i = 0; i < 3; i += 1) {
            td = Y.Node.create('<td></td>');
            td.appendChild(create_block_cells(row, i));
            tr.appendChild(td);
        }
        return tr;
    };

    create_block_cells = function (block_row, block_col) {
        var table = Y.Node.create('<table border="1"></table>'), block_num = block_row * 3 + block_col + 1, i, j, tr, td, data;
        for (i = 0; i < 3; i += 1) {
            tr = Y.Node.create('<tr></tr>');
            for (j = 0; j < 3; j += 1) {
                td = Y.Node.create('<td></td>');
                data = {
                    block: block_num,
                    row: block_row * 3 + i + 1,
                    col: block_col * 3 + j + 1,
                    value: 0
                };
                td.addClass('cell');
                td.addClass('block_' + data.block);
                td.addClass('row_' + data.row);
                td.addClass('col_' + data.col);
                td.setData('loc', data);
                create_cell_options(td);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    };

    option_dblclick = function (e) {
        select_option(e.target);
        e.halt();
        return true;
    };

    option_rightclick = function (e) {
        if (e.target.get('text') === '') {
            e.target.set('text', e.target.getData('option'));
        } else {
            e.target.set('text', '');
        }
    };

    select_option = function (opt) {
        var value = opt.get('text'), cell, loc;
        if (value === '') {
            return;
        }
        cell = opt.ancestor('.cell');
        loc = cell.getData('loc');
        loc.value = parseInt(value, 10);
        cell.setContent('');
        cell.set('text', value);

        // remove other options;
        remove_other_options(loc);

        cell.on('dblclick', cell_dblclick);
    };

    remove_other_options = function (loc) {
        node.all('td.cell.block_' + loc.block + ' td.option_' + loc.value).each(function (n) {
            n.set('text', '');
            Y.detach('contextmenu', option_rightclick, n);
        });
        node.all('td.cell.row_' + loc.row + ' td.option_' + loc.value).each(function (n) {
            n.set('text', '');
            Y.detach('contextmenu', option_rightclick, n);
        });
        node.all('td.cell.col_' + loc.col + ' td.option_' + loc.value).each(function (n) {
            n.set('text', '');
            Y.detach('contextmenu', option_rightclick, n);
        });
    };

    cell_dblclick = function (e) {
        var cell = e.target, loc;

        if (!cell.hasClass('cell')) {
            Y.log(e);
            // make sure the event is on the cell
            return false;
        }
        node.setStyle('display', 'none');
        loc = cell.getData('loc');
        loc.value = 0;
        cell.set('text', '');
        recreate_cells('td.cell');
        node.setStyle('display', null);
    };

    recreate_cells = function (selector) {
        node.all(selector).each(function (n) {
            var loc = n.getData('loc');
            if (loc.value === 0) {
                n.setContent('');
                create_cell_options(n);
            }
        });

        node.all(selector).each(function (n) {
            var loc = n.getData('loc');
            if (loc.value !== 0) {
                remove_other_options(loc);
            }
        });
    };

    create_cell_options = function (cell) {
        var table = Y.Node.create('<table/>'), i, j, tr, td, option;
        for (i = 0; i < 3; i += 1) {
            tr = Y.Node.create('<tr></tr>');
            for (j = 0; j < 3; j += 1) {
                td = Y.Node.create('<td></td>');
                option = i * 3 + j + 1;
                td.set('text', option);
                td.addClass('option');
                td.addClass('option_' + option);
                td.on('dblclick', option_dblclick);
                td.on('contextmenu', option_rightclick);
                td.setData('option', option);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        cell.appendChild(table);
    };

    for (i = 0; i < 3; i += 1) {
        tr = create_main_tr(i);
        mainTable.appendChild(tr);
    }
    node.appendChild(mainTable);
});
