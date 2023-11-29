import { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import {
    TextField,
    IconButton,
    InputAdornment,
    Button,
    Modal,
    Box,
} from "@mui/material";
import Papa from "papaparse";
import PropTypes from 'prop-types';
import { NAV_ITEMS } from '../../constants'

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const isEmpty = (record) => {
    return Object.values(record).some((x) => x === "");
};
const NO_FILE_SELECTED = "No file selected";

const DashBoardHeader = ({ playersData, setPlayersData, setPlayerTableImport, searchString, setSearchString, setFilteredPlayersData, activeNavItem }) => {
    const [initailRosterEdit, setInitialRosterEdit] = useState(false);
    const [mouseOverTitle, setMouseOverTitle] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [fileName, setFileName] = useState(NO_FILE_SELECTED);
    const [csvError, setCsvError] = useState(false);
    const [rosterData, setRosterData] = useState(null)

    useEffect(() => {
        setPlayerTableImport(() => handleImportClick)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRosterNameEdit = () => {
        setInitialRosterEdit(true);
    };
    const handleTitleHover = () => {
        if (initailRosterEdit) {
            setMouseOverTitle(true);
        }
    };

    const handleTitleLeave = () => {
        if (initailRosterEdit) {
            setMouseOverTitle(false);
        }
    };

    const handleImportClick = () => {
        setImportModal(true);
    };
    const handlleImportModalClose = () => {
        setImportModal(false);
        setCsvError(false);
        setRosterData(null);
        setFileName(NO_FILE_SELECTED);
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;

        if (files) {
            setFileName(files[0].name);
            console.log(files[0]);
            Papa.parse(files[0], {
                header: true,
                fields: ["Player Name"],
                complete: function (results) {
                    console.log("Finished:", results.data);
                    const csvData = results.data;
                    for (let i = 0; i < csvData.length; i++) {
                        if (isEmpty(csvData[i])) {
                            setCsvError(true);
                            setRosterData(null);
                            break;
                        }
                        if (i === csvData.length - 1 && !isEmpty(csvData[i])) {
                            setCsvError(false);
                            setRosterData(csvData);
                        }
                    }
                },
            });
        }
    };

    const getSummary = () => {
        return (
            <>
                <div className="fileSummaryHead">File Summary</div>
                <table className="summary-table">
                    <thead>
                        <tr>
                            <th>Total Players</th>
                            <th>Goalkeepers</th>
                            <th>Defenders</th>
                            <th>Midfielders</th>
                            <th>Forwards</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{rosterData.length}</td>
                            <td>
                                {
                                    rosterData.filter((row) => {
                                        return row.Position === "Goalkeeper";
                                    }).length
                                }
                            </td>
                            <td>
                                {
                                    rosterData.filter((row) => {
                                        return row.Position === "Defender";
                                    }).length
                                }
                            </td>
                            <td>
                                {
                                    rosterData.filter((row) => {
                                        return row.Position === "Midfielder";
                                    }).length
                                }
                            </td>
                            <td>
                                {
                                    rosterData.filter((row) => {
                                        return row.Position === "Forward";
                                    }).length
                                }
                            </td>
                        </tr>
                    </tbody>

                </table>
            </>
        );
    };

    const handleImportData = () => {
        setPlayersData(rosterData);
        setFilteredPlayersData(rosterData)
        setSearchString('')
        handlleImportModalClose();
    };


    return (
        <section className="dashboard-root">
            <header className="header">
                <div className="title-box">
                    <p className="label">Roster Details</p>
                    <div
                        className="title-input"
                        onMouseOver={handleTitleHover}
                        onMouseLeave={handleTitleLeave}
                    >
                        <span contentEditable="true" suppressContentEditableWarning spellCheck="false" onInput={handleRosterNameEdit}>
                            My Team
                        </span>
                        {(!initailRosterEdit || mouseOverTitle) && (
                            <span className="edit">
                                <IconButton>
                                    <CreateIcon />
                                </IconButton>
                            </span>
                        )}
                    </div>
                </div>
                {(activeNavItem === NAV_ITEMS.MENU) && <div className="search">
                    <TextField
                        className="search-input"
                        placeholder="Find Player"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                searchString && <InputAdornment position="end">
                                    <CloseIcon className="clear-search" onClick={() => setSearchString('')} />
                                </InputAdornment>
                            ),
                        }}
                        value={searchString}
                        onKeyDown={
                            (e) => {
                                if (e.key === "Escape") {
                                    setSearchString('')
                                    return
                                }
                            }
                        }
                        onChange={(e) => {
                            setSearchString(e.target.value)
                        }}
                    />
                    <Button
                        className="button-wrapper primary-button-wrapper"
                        variant={playersData?.length ? "outlined" : "contained"}
                        onClick={handleImportClick}
                    >
                        {playersData?.length ? 'Re-Import Team' : 'Import Team'}
                    </Button>
                </div>}

            </header>
            <Modal open={importModal}>
                <Box className="import-modal">
                    <header className="import-modal-header">
                        <p className="title">Importer</p>
                        <CloseIcon
                            className="import-close"
                            onClick={handlleImportModalClose}
                        />
                    </header>
                    <hr />
                    <p className="roster-file">Roster File</p>
                    <div className={csvError ? "select has-error" : "select"}>
                        <p className="file-name">{fileName}</p>{" "}
                        <Button
                            variant="outlined"
                            className={
                                csvError ? "select-file-button has-error" : "select-file-button"
                            }
                            component="label"
                        >
                            Select File{" "}
                            <VisuallyHiddenInput
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                            />
                        </Button>
                    </div>
                    <p
                        className={
                            csvError
                                ? "import-helper-text error-helper-text"
                                : "import-helper-text"
                        }
                    >
                        {csvError ? "Error" : "File must be in .csv format"}
                    </p>
                    {csvError && (
                        <p className="missing-fileds">
                            Your sheet is missing data. Please ensure all cells are filled
                            out.
                        </p>
                    )}

                    {rosterData && getSummary()}

                    <footer className="import-modal-footer">
                        <Button
                            className="import-data-button"
                            variant={rosterData ? "contained" : "text"}
                            onClick={handleImportData}
                            disabled={!rosterData}
                        >
                            Import
                        </Button>
                    </footer>
                </Box>
            </Modal>
        </section>
    );
};

DashBoardHeader.propTypes = {
    setPlayersData: PropTypes.func,
    playersData: PropTypes.array,
    setPlayerTableImport: PropTypes.func,
    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    setFilteredPlayersData: PropTypes.func,
    activeNavItem: PropTypes.string,
}

export default DashBoardHeader;
