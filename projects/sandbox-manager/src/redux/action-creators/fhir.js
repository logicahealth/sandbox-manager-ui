import * as types from "./types";
import API from '../../lib/api';

export function fhir_Reset () {
    return { type: types.FHIR_RESET };
}

export function fhir_SetContext (context) {
    return {
        type: types.FHIR_SET_CONTEXT,
        payload: context
    };
}

export function fhir_SetMeta (payload) {
    return {
        type: types.FHIR_SET_META,
        payload
    };
}

export function fhir_SetParsedPatientDemographics (data) {
    return {
        type: types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS,
        payload: data
    };
}

export function fhir_setCustomSearchExecuting (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_EXECUTING,
        payload: { executing }
    };
}

export function fhir_setLoadingMetadata (loading) {
    return {
        type: types.FHIR_SET_METADATA_LOADING,
        payload: { loading }
    };
}

export function fhir_setLoadingResources (loading) {
    return {
        type: types.FHIR_SET_RESOURCES_LOADING,
        payload: { loading }
    };
}

export function fhir_setMetadata (data) {
    return {
        type: types.FHIR_SET_METADATA,
        payload: { data }
    };
}

export function fhir_setResources (data) {
    return {
        type: types.FHIR_SET_RESOURCES,
        payload: { data }
    };
}

export function fhir_setResourcesCount (data) {
    return {
        type: types.FHIR_SET_RESOURCES_COUNT,
        payload: { data }
    };
}

export function fhir_setValidationResults (results) {
    return {
        type: types.FHIR_SET_VALIDATION_RESULTS,
        payload: { results }
    };
}

export function fhir_setValidationExecuting (executing) {
    return {
        type: types.FHIR_SET_VALIDATION_EXECUTING,
        payload: { executing }
    };
}

export function fhir_setCustomSearchGettingNextPage (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_GETTING_NEXT_PAGE,
        payload: { executing }
    };
}

export function cleanValidationResults () {
    return {
        type: types.FHIR_CLEAN_VALIDATION_RESULTS
    };
}

export function fhir_setProfilesLoading (loading) {
    return {
        type: types.FHIR_SET_PROFDILES_LOADING,
        payload: { loading }
    };
}

export function fhir_setProfiles (profiles) {
    return {
        type: types.FHIR_SET_PROFDILES,
        payload: { profiles }
    };
}

export function fhir_SetSampleData () {
    return { type: types.FHIR_SET_SAMPLE_DATA };
}

export function fhir_setCustomSearchResults (results) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_RESULTS,
        payload: { results }
    }
}

export function fhir_setCustomSearchResultsNext (results) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_RESULTS_NEXT,
        payload: { results }
    }
}

export function fhir_setExportSearchResults (exportResults) {
    return {
        type: types.FHIR_SET_EXPORT_SEARCH_RESULTS,
        payload: { exportResults }
    }
}

export function fhir_SetSmart (payload) {
    return dispatch => {
        if (payload.status === 'ready') {
            window.fhirClient = FHIR.client({
                serviceUrl: payload.data.server.serviceUrl, // Overwrite response.iss with internal Fhir Api data store
                credentials: 'include',
                auth: {
                    type: 'bearer',
                    token: payload.data.tokenResponse.access_token
                }
            });
        }

        dispatch({ type: types.FHIR_SET_SMART, payload });
    }
}

export function customSearch (query, endpoint) {
    return dispatch => {
        dispatch(fhir_setCustomSearchResults(null));
        dispatch(fhir_setCustomSearchExecuting(true));

        endpoint = endpoint ? endpoint : window.fhirClient.server.serviceUrl;
        API.get(`${endpoint}/${query}`, dispatch)
            .then(data => {
                dispatch(fhir_setCustomSearchResults(data));
                dispatch(fhir_setCustomSearchExecuting(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchExecuting(false));
            });
    }
}

export function loadProfiles () {
    return dispatch => {
        dispatch(fhir_setProfilesLoading(true));

        let endpoint = window.fhirClient.server.serviceUrl;
        API.get(`${endpoint}/StructureDefinition?_count=50`, dispatch)
            .then(data => {
                dispatch(fhir_setProfiles(data.entry.map(i => i.resource)));
                dispatch(fhir_setProfilesLoading(false));
            })
            .catch(() => {
                dispatch(fhir_setProfilesLoading(false));
            });
    }
}

export function uploadProfile (file) {
    return (dispatch, getState) => {
        let state = getState();
        let config = state.config.xsettings.data.sandboxManager;
        let formData = new FormData();
        formData.append("file", file);
        dispatch(fhir_setProfilesLoading(true));

        let url = config.baseServiceUrl_1;
        if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "2") {
            url = config.baseServiceUrl_2;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "3") {
            url = config.baseServiceUrl_3;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "4") {
            url = config.baseServiceUrl_4;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "5") {
            url = config.baseServiceUrl_5;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "6") {
            url = config.baseServiceUrl_6;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "7") {
            url = config.baseServiceUrl_7;
        }

        API.post(`${url}/profile/uploadProfile?file=${file.name}&sandboxId=${sessionStorage.sandboxId}`, formData, dispatch, true)
            .then(data => {
                dispatch(fhir_setCustomSearchResults(data));
                dispatch(loadProfiles());
            })
            .catch(() => {
                dispatch(fhir_setProfilesLoading(false));
            });
    }
}

export function getMetadata (shouldGetResourcesCount = true) {
    return dispatch => {
        dispatch(fhir_setLoadingMetadata(true));
        API.get(`${window.fhirClient.server.serviceUrl}/metadata?_format=json&_pretty=true`, dispatch)
            .then(data => {
                dispatch(fhir_setMetadata(data));
                shouldGetResourcesCount && dispatch(getResourcesCount(data.rest[0].resource));
                dispatch(fhir_setLoadingMetadata(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingMetadata(false));
            });
    }
}

export function fetchResources (type, query = "") {
    return dispatch => {
        dispatch(fhir_setLoadingResources(true));
        API.get(`${window.fhirClient.server.serviceUrl}/${type}?_count=40${query}`, dispatch)
            .then(data => {
                dispatch(fhir_setResources(data));
                dispatch(fhir_setLoadingResources(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingResources(false));
            });
    }
}

export function validate (object) {
    return dispatch => {
        dispatch(fhir_setValidationResults(null));
        dispatch(fhir_setValidationExecuting(true));

        API.postNoErrorManagement(`${window.fhirClient.server.serviceUrl}/${object.resourceType}/$validate`, object, dispatch)
            .then(data => {
                dispatch(fhir_setValidationResults(data));
                dispatch(fhir_setValidationExecuting(false));
            })
            .catch((e) => {
                dispatch(fhir_setValidationResults(e));
                dispatch(fhir_setValidationExecuting(false));
            });
    }
}

export function validateExisting (url, selectedProfile) {
    return dispatch => {
        dispatch(fhir_setValidationResults(null));
        dispatch(fhir_setValidationExecuting(true));

        if (!selectedProfile) {
            API.get(`${window.fhirClient.server.serviceUrl}/${url}/$validate`, dispatch)
                .then(data => {
                    dispatch(fhir_setValidationResults(data));
                    dispatch(fhir_setValidationExecuting(false));
                })
                .catch((e) => {
                    dispatch(fhir_setValidationResults(e));
                    dispatch(fhir_setValidationExecuting(false));
                });
        } else {
            API.get(`${window.fhirClient.server.serviceUrl}/${url}`, dispatch)
                .then(data => {
                    if (data.resourceType) {
                        !data.meta && (data.meta = {});
                        data.meta.profile = [selectedProfile];
                        dispatch(validate(data));
                    }
                })
                .catch((e) => {
                    dispatch(fhir_setValidationResults(e));
                    dispatch(fhir_setValidationExecuting(false));
                });
        }
    }
}

export function getResourcesCount (data, query = "") {
    return dispatch => {
        let counts = {};
        let promises = [];
        data.map(res => {
            promises.push(new Promise(resolve => {
                API.get(`${window.fhirClient.server.serviceUrl}/${res.type}?_count=1${query}`, dispatch)
                    .then(d => {
                        counts[res.type] = d.total;
                        resolve();
                    })
            }))
        });
        Promise.all(promises)
            .then(() => {
                dispatch(fhir_setResourcesCount(counts));
            })
    };
}

export function customSearchNextPage (link) {
    return dispatch => {
        dispatch(fhir_setCustomSearchGettingNextPage(true));

        API.get(link.url, dispatch)
            .then(data => {
                dispatch(fhir_setCustomSearchResultsNext(data));
                dispatch(fhir_setCustomSearchGettingNextPage(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchGettingNextPage(false));
            });
    }
}

export function clearSearchResults () {
    return dispatch => {
        dispatch(fhir_setCustomSearchResults());
    }
}
