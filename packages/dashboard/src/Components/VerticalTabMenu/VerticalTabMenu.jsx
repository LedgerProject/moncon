import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel  from '../TapsPanel/TapsPanel'; 
import SectionTitle from '../SectionTitle';
import { Grid } from '@material-ui/core';

function a11yProps(index) {
    return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabMenu(props) {
    const { children, labels, title } = props;
    console.log(children[0].type.name)
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container>
            {title &&  <Grid item xs={12}>
                            <SectionTitle title={title} />
                        </Grid>
            }
            <Grid item xs={3}>
                <Tabs
                orientation="vertical"
                value={value}
                indicatorColor="primary"
                onChange={handleChange}
                aria-label="Vertical tabs">

                    {labels.map((label) =>(
                        <Tab label={label} {...a11yProps(labels.indexOf(label))}  />
                    ))}
                </Tabs>
            </Grid>
            <Grid item xs={9}>
                {children.map((Children,index) => (
                    <TabPanel value={value} index={index}>
                        {Children}
                    </TabPanel>
                ))}
            </Grid>
        </Grid>
    );
}