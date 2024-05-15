import { I18n } from '@atlassian/wrm-react-i18n';
import { string } from 'prop-types';
import React, { memo, useCallback, useState } from 'react';

import { useChanges } from '@bitbucket/feature/changes/changes-context';
import CommitPropType from '@bitbucket/util/prop-types/commit';
import ServerError from '@bitbucket/widget/server-error';
import * as analytics from 'bitbucket/internal/util/analytics';

import ChangesWithViewFileContext from './changes-with-view-file-context';
import { CommitRangeProvider } from './contexts/commit-range-context';
import './changes.less';

export const sendSidebarCollapsedAnalytics = (collapsed) => {
    const data = {
        state: collapsed ? 'collapsed' : 'open',
    };

    analytics.add('diff-view.sidebar.toggle', data);
    analytics.add('diff-view.sidebar.toggle.extra.data', data);
};

const Changes = ({ commit, sinceCommitId }) => {
    const {
        allFetched,
        areChangesTruncated,
        isError,
        changes,
        change,
        fromHash,
        toHash,
    } = useChanges();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebarCollapsed = useCallback(
        () =>
            setSidebarCollapsed((old) => {
                sendSidebarCollapsedAnalytics(!old);

                return !old;
            }),
        []
    );

    if (isError) {
        return (
            <div className="changes">
                <ServerError title={I18n.getText('bitbucket.web.changes.error.loading.title')} />
            </div>
        );
    }

    return (
        <div className="changes">
            <CommitRangeProvider
                fromHash={fromHash}
                toHash={toHash}
                commit={commit}
                sinceCommitId={sinceCommitId}
            >
                <ChangesWithViewFileContext
                    change={change}
                    changes={changes}
                    sinceCommitId={sinceCommitId}
                    commit={commit}
                    sidebarCollapsed={sidebarCollapsed}
                    allFetched={allFetched}
                    areChangesTruncated={areChangesTruncated}
                    toggleSidebarCollapsed={toggleSidebarCollapsed}
                />
            </CommitRangeProvider>
        </div>
    );
};

Changes.propTypes = {
    commit: CommitPropType,
    sinceCommitId: string,
};

export default memo(Changes);
