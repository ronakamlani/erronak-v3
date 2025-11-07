import { Button } from 'components/Button';
import { DecoderText } from 'components/DecoderText';
import { Divider } from 'components/Divider';
import { Footer } from 'components/Footer';
import { Heading } from 'components/Heading';
import { Input } from 'components/Input';
import { ToastContainer, toast } from 'react-toastify';
import { Meta } from 'components/Meta';
import { Section } from 'components/Section';
import { tokens } from 'components/ThemeProvider/theme';
import { Transition } from 'components/Transition';
import { cssProps, msToNum, numToMs } from 'utils/style';
import styles from './Contact.module.css';

const MY_EMAIL = "info@erronak.com";

export const Contact = () => {
  const initDelay = tokens.base.durationS;
  const doCopyEmail = () => {
    navigator.clipboard.writeText(MY_EMAIL).then(() => {
      toast.success(`copied: ${MY_EMAIL}`);
    }).catch((err) => {
      toast.error(`Failed! ping me here please: ${MY_EMAIL}`);
    });
  };
  
  return (
    <Section className={styles.contact}>
      <Meta
        title="Contact"
        description="Send me a message if you’re interested in discussing a project or if you just want to say hi"
      />
      <Transition unmount in={true} timeout={1600}>
        {(visible, status) => (
          <form className={styles.form} method="post" onSubmit={undefined}>
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            <Input
              required
              disabled={true}
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              value={"info@erronak.com"}
              label="Ping me at"
              type="email"
              maxLength={512}
              readOnly={true}
              ref={(input) => {
                if (input) {
                  input.select(); // auto-selects the text inside input when rendered
                }
              }}
            />
          <Button
              className={styles.button}
              style={getDelay(tokens.base.durationM, initDelay)}
              data-status={status}
              disabled={false}
              loading={false}
              loadingText="Sending..."
              icon="send"
              type="button"
              onClick={doCopyEmail}
            > 
              {`Copy ${MY_EMAIL}`}
            </Button>
        </form>)}
        </Transition>
      <Footer className={styles.footer} />
      <ToastContainer 
        theme='dark'
      />
    </Section>
  );
};

function getStatusError({
  status,
  errorMessage,
  fallback = 'There was a problem with your request',
}) {
  if (status === 200) return false;

  const statuses = {
    500: 'There was a problem with the server, try again later',
    404: 'There was a problem connecting to the server. Make sure you are connected to the internet',
  };

  if (errorMessage) {
    return errorMessage;
  }

  return statuses[status] || fallback;
}

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
