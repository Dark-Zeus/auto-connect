import React, { useEffect, useState } from 'react';
import $ from 'jquery';

import IconButton from './IconButton';

import './AdaptiveTable.css';
import OverlayWindow from '../OverlayWindow';

/**
 * @description AdaptiveTable is a component that displays data in a table format. 
 * The table can be toggled to show or hide the data and can be paginated.
 *  
 * @param {String} tableId - unique id for the table
 * @param {String} title - title of the table
 * @param {String} subtitle - subtitle of the table
 * @param {Object[]} headers - headers of the table. Should be an array of `objects` with the following properties: 
 * ```
 * {
 *      colKey: string // key to access the data in the data array
 *      icon: string // icon to display before the label. should be a google material 
 *      iconlabel: string // label to display as the header
 * }
 * ```
 * @param {object[]} data - data to display in the table. Should be an array of `objects` containing the keys specified in the headers
 * @param {Number} pagination - number of items to display per page
 * @param {React.Component} filters - filters to display above the table. Should be a `React` component
 * @param {Number} filterWidth - width of the filter container
 * @param {Function} onAddBtnClick - function to call when the add button is clicked
 * @param {Function} onReportBtnClick - function to call when the report button is clicked
 * @returns
 */
function AdaptiveTable({ tableId, title, subtitle, headers, data, truncateValues, totalRecords, pagination = 5, filters, filterWidth, actions, onAddBtnClick, onReportBtnClick, isExportBtn, isAddBtn, isSettingsBtn, isCollapsible, defaultColumnVisibility = true }) {

    const [isOverlaySettingWindowOpen, setIsOverlaySettingWindowOpen] = useState(false)
    const [view, setView] = useState(true)
    const [page, setPage] = useState(1)
    const [activeHeaders, setActiveHeaders] = useState(headers.filter((header) => header.visible ?? defaultColumnVisibility));

    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(pagination)

    tableId = tableId || `${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 1000000)}`;
    data = data || [];
    filterWidth = filterWidth || "400";

    useEffect(() => {
        setStartIndex((page - 1) * pagination);
        setEndIndex(page * pagination);
    }, [page, pagination])

    const toggle = () => {
        $(`#${tableId}__table-container`).slideToggle(500);
        setView(!view)
    }

    const setActiveHeadersVisibility = (colKey, visible) => {
        const newHeaders = headers;
        const headerIndex = newHeaders.findIndex((header) => header.colKey === colKey);
        if (headerIndex !== -1) {
            newHeaders[headerIndex].visible = visible;
        }
        setActiveHeaders(newHeaders.filter((header) => header.visible));
    }

    const prepareColumnsForSettings = () => {
        const columns = headers.map((header) => {
            return {
                colKey: header.colKey,
                label: header.label,
                icon: <i className="material-symbols-outlined adaptive-table__header-icon">{header.icon}</i>,
                visible: <input type="checkbox" checked={header.visible ?? defaultColumnVisibility} onChange={(e) => setActiveHeadersVisibility(header.colKey, e.target.checked)} />
            }
        });

        return columns;
    }

    return (
        <>
            <div className={`adaptive-table-container`} id={tableId}>
                <div className={`adaptive-table__title ${view ? "" : "hidden"}`}>
                    <span className="adaptive-table__title-container">
                        <span className="adaptive-table__title-text">{title}</span>
                        {subtitle && <span className="adaptive-table__subtitle">{subtitle}</span>}
                    </span>

                    {
                        filters && <div className="adaptive-table__fiter-container" style={{ "width": `${filterWidth}px` }}>
                            {filters}
                        </div>
                    }
                    <div className="horizontal-container">
                        {isExportBtn && <IconButton onClick={onReportBtnClick} iconb={"file_save"} h={30} c="blue" content={"Export"} />}
                        {isAddBtn && <IconButton onClick={onAddBtnClick} iconb={"add"} h={30} bg="green" c="white" content={"Add"} />}
                        {isSettingsBtn && <IconButton onClick={() => setIsOverlaySettingWindowOpen(true)} iconb={"settings"} h={30} bg="white" c="green" />}
                        <div></div>
                        {
                            isCollapsible && (view ? <IconButton onClick={toggle} size={30} icona={"keyboard_arrow_down"} /> : <IconButton size={30} onClick={toggle} icona={"keyboard_arrow_up"} />)
                        }
                    </div>
                </div>
                <div id={`${tableId}__table-container`}>
                    <div className='adaptive-table__table-container'>
                        <table className="adaptive-table" id={`${tableId}__table`}>
                            <thead className="adaptive-table__header">
                                <tr className='adaptive-table__row'>
                                    {
                                        activeHeaders.map((col, index) => (
                                            <td className="adaptive-table__col" key={index}>
                                                <span className="adaptive-table-header-col">
                                                    {col.icon && <span className='material-symbols-outlined adaptive-table__header-icon'>{col.icon}</span>}
                                                    {col.label}
                                                </span>

                                            </td>
                                        ))
                                    }
                                    {actions?.enable ?
                                        <td className="adaptive-table__col">
                                            <span className="adaptive-table-header-col">
                                                {actions.actionHeaderIcon && <span className='material-symbols-outlined adaptive-sub-table__header-icon'>{actions.actionHeaderIcon}</span>}
                                                {actions.actionHeaderLabel && actions.actionHeaderLabel}
                                            </span>
                                        </td> : null
                                    }
                                </tr>
                            </thead>
                            <tbody className="adaptive-table__body">
                                {
                                    data.slice(startIndex, endIndex).map((row, index) => (
                                        <tr className="adaptive-table__row" key={index}>
                                            {activeHeaders.map((col, colIndex) => {
                                                const header = headers.find(h => h.colKey === col.colKey);
                                                const value = row[col.colKey];

                                                return (
                                                    <td className={`adaptive-table__col ${truncateValues && "adaptive-table__col--truncate"}`} key={`${col.colKey}-${colIndex}`} title={value}>
                                                        {typeof header?.container === 'function'
                                                            ? header.container(value, row)  // dynamic rendering
                                                            : header?.container
                                                                ? React.cloneElement(header.container, { children: value }) // static JSX
                                                                : value || ''}
                                                    </td>
                                                );
                                            })}

                                            {actions?.enable ?
                                                <td className="adaptive-table__col">
                                                    <span className={actions.dataContainerClass}>
                                                        {actions.getActions
                                                            ? actions.getActions(row).map((action, i) => React.cloneElement(action, { key: i }))
                                                            : actions.actions.map((action, i) => React.cloneElement(action, { key: i }))
                                                        }
                                                    </span>
                                                </td> : null
                                            }
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="adaptive-table__footer">
                    <span className='horizontal-container flex-start adaptive-table__footer-text'>
                        {(() => {
                            const totalPages = Math.ceil((totalRecords || data.length) / pagination);
                            const maxButtons = 5;

                            // Calculate start and end page numbers for current group
                            let start = Math.max(1, page - Math.floor(maxButtons / 2));
                            let end = start + maxButtons - 1;
                            if (end > totalPages) {
                                end = totalPages;
                                start = Math.max(1, end - maxButtons + 1);
                            }

                            const pages = [];
                            if (page > 1) {
                                pages.push(
                                    <IconButton
                                        key="prev"
                                        extraClass="adaptive-table__page-btn"
                                        iconb={"keyboard_arrow_left"}
                                        onClick={() => setPage(page - 1)}
                                        w="40"
                                    />
                                );
                            }

                            for (let i = start; i <= end; i++) {
                                pages.push(
                                    <IconButton
                                        extraClass={`adaptive-table__page-btn ${page === i ? "active" : ""}`}
                                        key={i}
                                        onClick={() => setPage(i)}
                                        content={i}
                                        w="40"
                                    />
                                );
                            }

                            if (page < totalPages) {
                                pages.push(
                                    <IconButton
                                        key="next"
                                        extraClass="adaptive-table__page-btn"
                                        icona={"keyboard_arrow_right"}
                                        onClick={() => setPage(page + 1)}
                                        w="40"
                                    />
                                );
                            }

                            return pages;
                        })()}
                    </span>
                    <span className='horizontal-container flex-center adaptive-table__footer-text'>
                        {`Showing ${startIndex + 1} to ${Math.min(endIndex, totalRecords || data.length)} of ${totalRecords || data.length} entries`}
                    </span>
                    <span className='horizontal-container flex-end adaptive-table__footer-text'>
                        {`Page ${page} of ${Math.ceil((totalRecords || data.length) / pagination)}`}
                    </span>
                </div>
            </div>

            {
                isOverlaySettingWindowOpen &&
                <OverlayWindow closeWindowFunction={() => setIsOverlaySettingWindowOpen(false)}>
                    <AdaptiveTable
                        title={"Column Visibility"}
                        headers={[
                            { colKey: "label", label: "Column", icon: "view_list", visible: true },
                            { colKey: "icon", label: "Icon", icon: "info", visible: true },
                            { colKey: "visible", label: "Visible", icon: "visibility", visible: true },
                        ]}

                        data={prepareColumnsForSettings()}
                        pagination={headers.length}

                    />
                </OverlayWindow>
            }
        </>
    )
}

export default AdaptiveTable;