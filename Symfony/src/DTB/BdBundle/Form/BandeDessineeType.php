<?php

namespace DTB\BdBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class BandeDessineeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('description')
            ->add('category')
            ->add('tags')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'DTB\BdBundle\Entity\BandeDessinee'
        ));
    }

    public function getName()
    {
        return 'dtb_bdbundle_bandedessineetype';
    }
}
