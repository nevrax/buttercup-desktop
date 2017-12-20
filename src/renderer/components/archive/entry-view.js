import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import {
  formRow,
  metaWrapper,
  heading,
  labelWrapper
} from '../../styles/entry-form';
import bubbleImage from '../../styles/img/info-bubble.svg';
import { Translate } from '../../../shared/i18n';
import EmptyView from '../empty-view';
import Copyable from './copyable';
import EntryIcon from './entry-icon';
import { Wrapper } from './entry-input';

export const LabelWrapper = styled.label`
  flex: 0 0 130px;
  min-height: var(--form-input-height);
  border-right: 1px solid var(--black-10);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  text-align: right;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75em;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  input {
    width: 100%;
    border: none;
    text-align: right;
  }
`;

const EntryView = ({ entry, t }) => (
  <div>
    {['title', 'username', 'password'].map(key => (
      <div className={formRow} key={key}>
        <LabelWrapper>
          <Choose>
            <When condition={key === 'title'}>
              <EntryIcon icon={entry.icon} big />
            </When>
            <Otherwise>{t(`entry.${key}`)}</Otherwise>
          </Choose>
        </LabelWrapper>
        <Wrapper isTitle={key === 'title'}>
          <Copyable type={key}>{entry.properties[key]}</Copyable>
        </Wrapper>
      </div>
    ))}
    <h6 className={heading}>
      <Translate i18nKey="entry.custom-fields" parent="span" />:
    </h6>
    {entry.meta.length > 0 ? (
      <div className={metaWrapper}>
        {entry.meta.map(meta => (
          <If condition={Object.keys(meta).length > 0}>
            <div className={formRow} key={meta.key}>
              <div className={labelWrapper}>{meta.key}</div>
              <Wrapper>
                <Copyable>{meta.value}</Copyable>
              </Wrapper>
            </div>
          </If>
        ))}
      </div>
    ) : (
      <EmptyView
        caption={t('entry.no-custom-fields-info-text')}
        imageSrc={bubbleImage}
      />
    )}
  </div>
);

EntryView.propTypes = {
  entry: PropTypes.object,
  t: PropTypes.func
};

export default translate()(EntryView);
