
const styles = {
    transform: 'scale(1)',
    height: '85vh',
    backgroundColor: 'rgb(243 243 243)',
    borderRadius: '15px',
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0',
    border: '1px solid hsla(203, 50%, 30%, 0.15)'
};

export const storyDecorator = storyFn => <div style={styles}>
    <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)', marginTop: '10px', }}>
        <div style={{
            border: '1px solid hsla(203, 50%, 30%, 0.15)',
            borderRadius: '50%',
            height: '10px',
            width: '10px',
            marginBottom: '10px',
            marginLeft: '10px'
        }}></div>
    </div>
    {storyFn()}
</div>;
