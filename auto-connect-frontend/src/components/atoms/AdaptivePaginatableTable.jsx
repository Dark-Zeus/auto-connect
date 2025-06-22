import React, { useMemo, useEffect, useState } from 'react';
import $ from 'jquery';

import IconButton from './IconButton';

import './AdaptiveTable.css';
import OverlayWindow from '../OverlayWindow';
import AdaptiveTable from './AdaptiveTable';
import RightIconRectInput from './RightIconRectInput';


function AdaptivePaginatableTable({ title, subtitle, tableId, headers = [], numbered = true, fetchData, data = [], truncateValues = true, serverPageSize, totalRecords, pagination = 5, filters, filterWidth, actions, isAddBtn, customizeAddBtn, onAddBtnClick, isExportBtn, onExportBtnClick, isSettingsBtn, isCollapsible, defaultColumnVisibility = true, stickyHeader = true, containInPage = true }) {
    // store visibility in a state map
    const [visibilityMap, setVisibilityMap] = useState({});
    const [serverPage, setServerPage] = useState(1);
    const [serverData, setServerData] = useState([]);

    const [totalRecordsNew, setTotalRecords] = useState((fetchData ? 0 : data.length));

    const [loading, setLoading] = useState(false);

    const [isOverlaySettingWindowOpen, setIsOverlaySettingWindowOpen] = useState(false)
    const [view, setView] = useState(true)
    const [page, setPage] = useState(1)
    const [pageInput, setPageInput] = useState(page);

    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(pagination)

    const stableTableId = React.useMemo(() => tableId || `${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 1000000)}`, []);
    filterWidth = filterWidth || "400";

    const sliceStart = ((page - 1) % (serverPageSize / pagination)) * pagination;
    const sliceEnd = sliceStart + pagination;
    const displayedData = fetchData ? serverData.slice(sliceStart, sliceEnd) : data.slice(startIndex, endIndex);

    const allHeaders = useMemo(() => {
        const base = [
            numbered ? {
                colKey: '_rowNumber',
                label: '',
                icon: "#",
                tdClass: "adaptive-table__col--count",
                container: (_value, _row, index) => <span className="adaptive-table__col--count">{startIndex + index + 1}</span>
            } : [],
            ...headers,
            actions?.enable
                ? {
                    colKey: '_actions',
                    label: actions.actionHeaderLabel || 'Actions',
                    icon: actions.actionHeaderIcon || 'settings',
                    container: (_value, row) => (
                        <span className={actions.dataContainerClass}>
                            {(actions.getActions ? actions.getActions(row) : actions.actions).map((btn, i) =>
                                React.cloneElement(btn, { key: i })
                            )}
                        </span>
                    )
                }
                : []
        ].flat();

        return base.map(h => ({
            ...h,
            visible: visibilityMap[h.colKey] ?? h.visible ?? defaultColumnVisibility,
        }));
    }, [headers, actions, numbered, startIndex, visibilityMap]);

    const [activeHeaders, setActiveHeaders] = useState(allHeaders.filter((header) => header.visible ?? defaultColumnVisibility));

    useEffect(() => {
        setStartIndex((page - 1) * pagination);
        setEndIndex(page * pagination);
    }, [page, pagination])

    useEffect(() => {
        setPageInput(page);
    }, [page]);

    useEffect(() => {
        if (fetchData && serverPageSize) {
            setLoading(true);

            fetchData().then(res => {
                const serverRecords = Array.isArray(res) ? res : res.data;
                setServerData(serverRecords || []);
                setTotalRecords(res.totalRecords || totalRecords);
                setLoading(false);
            }).catch((error) => {
                console.error('Fetch error:', error);
                setLoading(false);
            });
        }
    }, [fetchData, serverPageSize, totalRecords]);

    const handlePageChange = (newPage) => {
        const newServerPage = Math.floor((newPage - 1) / (serverPageSize / pagination)) + 1;

        if (fetchData && serverPageSize && newServerPage !== serverPage) {
            setServerPage(newServerPage);
        }

        setPage(newPage);
    };

    const toggle = () => {
        $(`#${stableTableId}__table-container`).slideToggle(500, () => {
            setView(!view);
        });
    }

    const setActiveHeadersVisibility = (colKey, visible) => {
        setVisibilityMap(prev => ({
            ...prev,
            [colKey]: visible
        }));

        const updatedHeaders = allHeaders.map(header =>
            header.colKey === colKey ? { ...header, visible } : header
        );
        setActiveHeaders(updatedHeaders.filter(header => header.visible));
    };


    const prepareColumnsForSettings = () => {
        return allHeaders.map((header) => ({
            colKey: header.colKey,
            label: header.label,
            icon: header.icon,
            container: typeof header.container === "function"
                ? "Custom Renderer"
                : header.container
                    ? "Static JSX"
                    : "Default",
            _visible: header.visible ?? defaultColumnVisibility,
        }));
    };



    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };


    return (
        <>
            <div className={`adaptive-table-container ${containInPage ? "contain" : ""}`} id={stableTableId}>
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
                        {isExportBtn && <IconButton onClick={onExportBtnClick} iconb={"file_save"} h={30} c="blue" content={"Export"} />}
                        {isAddBtn && <IconButton onClick={onAddBtnClick} iconb={customizeAddBtn?.icon ?? "add"} h={30} bg="green" c="white" content={customizeAddBtn?.content ?? "Add"} />}
                        {isSettingsBtn && <IconButton onClick={() => setIsOverlaySettingWindowOpen(true)} iconb={"settings"} h={30} bg="white" c="color" />}
                        <div></div>
                        {
                            isCollapsible && (view ? <IconButton onClick={toggle} size={30} icona={"keyboard_arrow_down"} /> : <IconButton size={30} onClick={toggle} icona={"keyboard_arrow_up"} />)
                        }
                    </div>
                </div>
                <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                    <div id={`${stableTableId}__table-container`} >
                        <div className='adaptive-table__table-container'>
                            <table className="adaptive-table" id={`${stableTableId}__table`}>
                                <thead className={`adaptive-table__header ${stickyHeader ? "sticky" : ""}`}>
                                    <tr className='adaptive-table__row'>
                                        {
                                            activeHeaders.map((col, index) => (
                                                <td className={`adaptive-table__col ${col.tdClass ?? ""}`} title={col.help ?? col.label} key={index}>
                                                    <span className="adaptive-table-header-col">
                                                        {col.icon && <span className='material-symbols-outlined adaptive-table__header-icon'>{col.icon}</span>}
                                                        {col.label}
                                                    </span>

                                                </td>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody className="adaptive-table__body">
                                    {
                                        loading ? (
                                            <tr className="adaptive-table__row">
                                                <td colSpan={activeHeaders.length + (actions?.enable ? 1 : 0) + (numbered ? 1 : 0)} className='adaptive-table__loader adaptive-table__col'>
                                                    <span className="loader-spinner" />
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : (
                                            displayedData.length !== 0 ? (
                                                activeHeaders.length !== 0 ? (
                                                    displayedData.map((row, index) => (
                                                        <tr className="adaptive-table__row" key={index}>
                                                            {activeHeaders.map((col, colIndex) => {
                                                                const header = allHeaders.find(h => h.colKey === col.colKey);
                                                                const value = getNestedValue(row, col.colKey) || row[col.colKey];

                                                                return (
                                                                    <td
                                                                        className={`adaptive-table__col ${truncateValues && "adaptive-table__col--truncate"} ${header.tdClass ?? ""}`}
                                                                        key={`${col.colKey}-${colIndex}`}
                                                                        title={value?.toString()}
                                                                    >
                                                                        {typeof header?.container === 'function'
                                                                            ? header.container(value?.toString(), row, index)  // dynamic rendering
                                                                            : header?.container
                                                                                ? React.cloneElement(header.container, { children: value?.toString() }) // static JSX
                                                                                : value?.toString() || ''}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr className="adaptive-table__row">
                                                        <td
                                                            colSpan={
                                                                (actions?.enable ? 1 : 0) +
                                                                (numbered ? 1 : 0) +
                                                                allHeaders.length
                                                            }
                                                            className="adaptive-table__col"
                                                        >
                                                            <div className="horizontal-container flex-center">
                                                                <i className='material-symbols-outlined' style={{ fontSize: "24px" }}>warning</i>At least one header is required to display data
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            ) : (
                                                <tr className="adaptive-table__row">
                                                    <td
                                                        colSpan={
                                                            (actions?.enable ? 1 : 0) +
                                                            (numbered ? 1 : 0) +
                                                            activeHeaders.length
                                                        }
                                                        className="adaptive-table__col"
                                                    >
                                                        No records found
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="adaptive-table__footer">
                    <span className='horizontal-container flex-start adaptive-table__footer-text'>
                        {(() => {
                            const totalPages = Math.ceil((totalRecordsNew || serverData.length || data.length) / pagination);
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
                                        onClick={() => handlePageChange(page - 1)}
                                        w="40"
                                        disabled={loading}
                                    />
                                );
                            }

                            for (let i = start; i <= end; i++) {
                                pages.push(
                                    <IconButton
                                        extraClass={`adaptive-table__page-btn ${page === i ? "active" : ""}`}
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        content={i}
                                        w="40"
                                        disabled={loading}
                                    />
                                );
                            }

                            if (page < totalPages) {
                                pages.push(
                                    <IconButton
                                        key="next"
                                        extraClass="adaptive-table__page-btn"
                                        icona={"keyboard_arrow_right"}
                                        onClick={() => handlePageChange(page + 1)}
                                        w="40"
                                        disabled={loading}
                                    />
                                );
                            }

                            return pages;
                        })()}
                        <div></div>
                        <div></div>
                        <div></div>
                        {totalRecordsNew ? <RightIconRectInput
                            width={"50px"}
                            type="number"
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (e.target.value === "") {
                                        e.target.value = 1;
                                    }
                                    const targetPage = Math.max(1, Math.min(parseInt(e.target.value), Math.ceil((totalRecordsNew || serverData.length || data.length) / pagination)));
                                    handlePageChange(targetPage);
                                }
                            }}
                            onBlur={(e) => {
                                const targetPage = Math.max(1, Math.min(parseInt(e.target.value), Math.ceil((totalRecordsNew || serverData.length || data.length) / pagination)));
                                handlePageChange(targetPage);
                            }}
                            disabled={loading}
                        /> : ""}
                    </span>
                    <span className='adaptive-table__footer-text horizontal-container flex-center'>
                        {loading ?
                            <>
                                <span className="loader-spinner--small" />
                                Loading...
                            </>
                            : `Showing ${startIndex + 1} to ${Math.min(endIndex, totalRecordsNew || serverData.length || data.length)} of ${totalRecordsNew || serverData.length || data.length} records`}
                    </span>
                    <span className='adaptive-table__footer-text horizontal-container flex-end'>
                        {loading ?
                            <>
                                <span className="loader-spinner--small" />
                                Loading...
                            </>
                            : `Loaded ${serverData.length || data.length} records from server`}
                    </span>
                </div>
            </div>

            {
                isOverlaySettingWindowOpen &&
                <OverlayWindow closeWindowFunction={() => setIsOverlaySettingWindowOpen(false)}>
                    <AdaptivePaginatableTable
                        title={"Column Visibility"}
                        headers={[
                            { colKey: "label", label: "Column", icon: "view_list", visible: true },
                            { colKey: "colKey", label: "Column Key", icon: "key", visible: true },
                            { colKey: "container", label: "Container", icon: "view_in_ar", visible: true },
                            {
                                colKey: "icon", label: "Icon", icon: "info", visible: true, container: (value) => (
                                    <i className="material-symbols-outlined adaptive-table__header-icon">
                                        {value || "null"}
                                    </i>
                                )
                            },
                            {
                                colKey: "_visible", label: "Visible", icon: "visibility", visible: true, container: (value, row) => (
                                    <input
                                        type="checkbox"
                                        checked={value ? value === "true" : defaultColumnVisibility}
                                        onChange={(e) => setActiveHeadersVisibility(row.colKey, e.target.checked)}
                                    />
                                )
                            }
                        ]}
                        numbered={false}
                        data={prepareColumnsForSettings()}
                        pagination={headers.length}

                    />
                </OverlayWindow>
            }
        </>
    )
}

export default AdaptivePaginatableTable;