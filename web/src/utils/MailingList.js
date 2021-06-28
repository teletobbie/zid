import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import '../styles/mailinglist.css';
import { connect } from 'react-redux';
import { setMailingList } from '../actions/projectAction';
import { TiDeleteOutline } from "react-icons/ti";

/**
 * Create and return a multi-mail JSX element. A input field to add multiple email addresses. More information: https://github.com/jsdevkr/react-multi-email
 * @param {object} props multi-mail element props.
 * @returns {JSX.Element} A multi-mail element. 
 */
const MailingList = ({mailingList, doSetMailingList}) => {
    return (
        <>
            <label>Mailinglist</label>
              <ReactMultiEmail
                emails={mailingList}
                onChange={_emails => {
                  doSetMailingList(_emails)
                }}
                validateEmail={email => {
                    return isEmail(email) && /@kpn.com\s*$/.test(email) 
                }}
                getLabel={(
                  email,
                  index,
                  removeEmail,
                ) => {
                  return (
                    <div className='ml-mail-show-label' key={index}>
                      {email}
                      <TiDeleteOutline className='ml-delete-icon' color='red' style={{cursor:'pointer'}} size={17} onClick={() => removeEmail(index)} />
                    </div>
                  );
                }}
              />
      </>
    )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    mailingList: state.project.mailingList
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetMailingList: setMailingList,
}

export default connect(mapStateToProps, mapDispatchToProps)(MailingList)
